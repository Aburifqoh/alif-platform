import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      purpose, room_type, hostel_gender, hostel_slug,
      next_of_kin_name, next_of_kin_phone, next_of_kin_rel,
      documents, session,
    } = body;

    // Validate required
    if (!purpose || !room_type || !session || !next_of_kin_name || !next_of_kin_phone || !hostel_slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check for existing active application for this session
    const { data: existing } = await supabase
      .from("hostel_applications")
      .select("id, status")
      .eq("applicant_id", user.id)
      .eq("session", session)
      .not("status", "in", '("rejected","cancelled")')
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: `You already have a ${existing.status} application for session ${session}.` },
        { status: 409 }
      );
    }

    // Map slug to hostel name
    const hostelNameMap: Record<string, string> = {
      "al-abraar":        "Al-Abraar Hostel",
      "sky-villa-male":   "Sky Villa — Male Block",
      "sky-villa-female": "Sky Villa — Female Block",
      "sky-villa-married":"Sky Villa — Married Quarters",
    };
    const hostelName = hostelNameMap[hostel_slug];

    const { data: hostel } = hostelName
      ? await supabase.from("hostels").select("id").eq("name", hostelName).eq("is_active", true).limit(1).maybeSingle()
      : { data: null };

    const { data: application, error: insertError } = await supabase
      .from("hostel_applications")
      .insert({
        applicant_id:     user.id,
        hostel_id:        hostel?.id ?? null,
        room_type,
        purpose,
        next_of_kin_name,
        next_of_kin_phone,
        next_of_kin_rel:  next_of_kin_rel ?? null,
        documents:        documents ?? [],
        session,
        status:           "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Hostel application insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Send confirmation email via Resend (best effort)
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: `${process.env.RESEND_FROM_NAME ?? "ALIF"} <${process.env.RESEND_FROM_EMAIL ?? "noreply@alif.ng"}>`,
        to: user.email!,
        subject: `Hostel Application Received — ${session}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:auto;">
            <div style="background:#0f5132;padding:32px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:20px;">ALIF Hostel Application</h1>
            </div>
            <div style="background:#fff;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
              <p>Assalamu Alaikum <strong>${profile?.full_name ?? ""}!</strong></p>
              <p>Your hostel application for session <strong>${session}</strong> has been received successfully.</p>
              <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                <tr><td style="padding:8px;color:#6b7280;font-size:14px;">Reference</td><td style="padding:8px;font-weight:600;font-family:monospace;">${application.id.slice(0, 8).toUpperCase()}</td></tr>
                <tr style="background:#f9fafb;"><td style="padding:8px;color:#6b7280;font-size:14px;">Session</td><td style="padding:8px;font-weight:600;">${session}</td></tr>
                <tr><td style="padding:8px;color:#6b7280;font-size:14px;">Room Type</td><td style="padding:8px;font-weight:600;text-transform:capitalize;">${room_type}</td></tr>
                <tr style="background:#f9fafb;"><td style="padding:8px;color:#6b7280;font-size:14px;">Status</td><td style="padding:8px;"><span style="background:#fef9c3;color:#92400e;padding:2px 8px;border-radius:99px;font-size:12px;font-weight:600;">Pending Review</span></td></tr>
              </table>
              <p style="font-size:14px;color:#6b7280;">Our hostel team will review your application within <strong>3–5 working days</strong>. You will receive another email once a decision has been made.</p>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/portal/hostel/application" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0f5132;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Track Application</a>
              <p style="margin-top:24px;font-size:12px;color:#9ca3af;">JazakAllahu Khayran — Al-Ibaanah Islamic Foundation</p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      // Don't fail the request if email fails
      console.warn("Email send failed:", emailErr);
    }

    return NextResponse.json({ success: true, application });
  } catch (err: unknown) {
    console.error("Hostel apply error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
