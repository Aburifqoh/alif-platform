import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@alif/database/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fee_id, email } = await req.json();
    if (!fee_id) return NextResponse.json({ error: "Missing fee_id" }, { status: 400 });

    // Fetch the fee and confirm it belongs to this user
    const { data: fee } = await supabase
      .from("hostel_fees")
      .select("*")
      .eq("id", fee_id)
      .eq("resident_id", user.id)
      .single();

    if (!fee) return NextResponse.json({ error: "Fee not found" }, { status: 404 });
    if (fee.status === "paid") return NextResponse.json({ error: "Fee already paid" }, { status: 409 });

    // Generate unique reference
    const reference = `ALIF-HOSTEL-${fee_id.slice(0, 8).toUpperCase()}-${Date.now()}`;

    // Call Paystack initialize
    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email ?? user.email,
        amount: Math.round(Number(fee.amount) * 100), // kobo
        reference,
        currency: "NGN",
        metadata: {
          fee_id,
          fee_type: fee.fee_type,
          period: fee.period,
          user_id: user.id,
          cancel_action: `${process.env.NEXT_PUBLIC_BASE_URL}/portal/hostel/payments`,
        },
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/hostel/payments/verify?reference=${reference}`,
      }),
    });

    const paystackData = await paystackRes.json();
    if (!paystackData.status) {
      return NextResponse.json({ error: paystackData.message ?? "Paystack initialization failed" }, { status: 502 });
    }

    // Store the reference on the fee record
    await supabase
      .from("hostel_fees")
      .update({
        paystack_ref: reference,
        paystack_access_code: paystackData.data.access_code,
      })
      .eq("id", fee_id);

    return NextResponse.json({
      reference,
      amount: Number(fee.amount),
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
    });
  } catch (err) {
    console.error("Payment initialize error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
