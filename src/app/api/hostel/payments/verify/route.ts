import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  try {
    // Verify with Paystack
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data.status !== "success") {
      return NextResponse.json({ success: false, message: paystackData.data?.gateway_response ?? "Payment not successful" });
    }

    const metadata = paystackData.data.metadata ?? {};
    const fee_id = metadata.fee_id;

    if (!fee_id) {
      return NextResponse.json({ success: false, message: "Missing fee metadata" });
    }

    // Use service role to update the fee record
    const supabase = await createClient();

    const { error: updateError } = await supabase
      .from("hostel_fees")
      .update({
        status:          "paid",
        paid_date:       new Date().toISOString().split("T")[0],
        payment_ref:     reference,
        paystack_ref:    reference,
        payment_channel: paystackData.data.channel,
      })
      .eq("id", fee_id);

    if (updateError) {
      console.error("Fee update error:", updateError);
      return NextResponse.json({ success: false, message: "Failed to update payment record" });
    }

    // Fetch user info to send receipt
    const { data: fee } = await supabase
      .from("hostel_fees")
      .select("*, resident:profiles(full_name, id)")
      .eq("id", fee_id)
      .single();

    // Send receipt email (best effort)
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const amount = Number(paystackData.data.amount) / 100;
        await resend.emails.send({
          from: `${process.env.RESEND_FROM_NAME ?? "ALIF"} <${process.env.RESEND_FROM_EMAIL ?? "noreply@alif.ng"}>`,
          to: user.email,
          subject: `Payment Receipt — ₦${amount.toLocaleString()} | ALIF Hostel`,
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:auto;">
              <div style="background:#0f5132;padding:32px;border-radius:12px 12px 0 0;text-align:center;">
                <h1 style="color:#fff;margin:0;font-size:20px;">Payment Receipt</h1>
              </div>
              <div style="background:#fff;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
                <p>Assalamu Alaikum <strong>${(fee?.resident as { full_name?: string })?.full_name ?? ""}!</strong></p>
                <p>Your hostel payment has been confirmed. Alhamdulillah!</p>
                <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                  <tr><td style="padding:8px;color:#6b7280;font-size:14px;">Amount</td><td style="padding:8px;font-weight:700;color:#0f5132;font-size:18px;">₦${amount.toLocaleString()}</td></tr>
                  <tr style="background:#f9fafb;"><td style="padding:8px;color:#6b7280;font-size:14px;">Reference</td><td style="padding:8px;font-family:monospace;font-size:12px;">${reference}</td></tr>
                  <tr><td style="padding:8px;color:#6b7280;font-size:14px;">Fee Type</td><td style="padding:8px;font-weight:600;text-transform:capitalize;">${fee?.fee_type?.replace("_", " ") ?? "—"}</td></tr>
                  <tr style="background:#f9fafb;"><td style="padding:8px;color:#6b7280;font-size:14px;">Period</td><td style="padding:8px;font-weight:600;">${fee?.period ?? "—"}</td></tr>
                  <tr><td style="padding:8px;color:#6b7280;font-size:14px;">Date</td><td style="padding:8px;font-weight:600;">${new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</td></tr>
                  <tr style="background:#f9fafb;"><td style="padding:8px;color:#6b7280;font-size:14px;">Channel</td><td style="padding:8px;font-weight:600;text-transform:capitalize;">${paystackData.data.channel ?? "—"}</td></tr>
                </table>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/portal/hostel/payments" style="display:inline-block;margin-top:8px;padding:12px 24px;background:#0f5132;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View Payments</a>
                <p style="margin-top:24px;font-size:12px;color:#9ca3af;">JazakAllahu Khayran — Al-Ibaanah Islamic Foundation</p>
              </div>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.warn("Receipt email failed:", emailErr);
    }

    // If called as a browser redirect (from Paystack callback), redirect to payments page
    const acceptHeader = req.headers.get("accept") ?? "";
    if (acceptHeader.includes("text/html")) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/portal/hostel/payments?paid=1`);
    }

    return NextResponse.json({ success: true, reference, amount: Number(paystackData.data.amount) / 100 });
  } catch (err) {
    console.error("Payment verify error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" });
  }
}
