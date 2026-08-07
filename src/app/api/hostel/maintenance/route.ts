import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description, priority } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Get user's current room from allocation
    const { data: allocation } = await supabase
      .from("room_allocations")
      .select("room_id")
      .eq("resident_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    const { data: request, error: insertError } = await supabase
      .from("maintenance_requests")
      .insert({
        reporter_id: user.id,
        room_id:     allocation?.room_id ?? null,
        title:       title.trim(),
        description: description?.trim() ?? null,
        priority:    priority ?? "normal",
        status:      "open",
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, request });
  } catch (err) {
    console.error("Maintenance request error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
