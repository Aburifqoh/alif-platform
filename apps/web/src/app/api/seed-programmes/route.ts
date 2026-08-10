import { createClient } from "@alif/database/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const programs = [
    {
      title: "Islamic Education",
      slug: "islamic-education",
      description: "Aqeedah · Fiqh · Hadith · Tafseer · Seerah",
      category: "Education",
      icon_name: "BookOpen",
      is_active: true,
      sort_order: 10,
    },
    {
      title: "Qur'an & Tajweed",
      slug: "quran-tajweed",
      description: "Recitation · Memorisation · Hifdh · Tajweed rules",
      category: "Education",
      icon_name: "Book",
      is_active: true,
      sort_order: 20,
    },
    {
      title: "Arabic Language",
      slug: "arabic-language",
      description: "Vocabulary · Grammar · Speaking · Writing",
      category: "Education",
      icon_name: "GraduationCap",
      is_active: true,
      sort_order: 30,
    },
    {
      title: "Youth Programs",
      slug: "youth-programs",
      description: "Mentorship · Leadership · Character development",
      category: "Youth",
      icon_name: "Users",
      is_active: true,
      sort_order: 40,
    },
    {
      title: "Da'wah",
      slug: "dawah",
      description: "Lectures · Outreach · Friday Khutbah · Seminars",
      category: "Da'wah",
      icon_name: "Mic",
      is_active: true,
      sort_order: 50,
    },
    {
      title: "Welfare Services",
      slug: "welfare-services",
      description: "Emergency aid · Scholarships · Medical support",
      category: "Welfare",
      icon_name: "HandHeart",
      is_active: true,
      sort_order: 60,
    },
    {
      title: "Hostel Management",
      slug: "hostel-management",
      description: "Accommodation · Structured life · Discipline",
      category: "Community",
      icon_name: "Globe", // or fallback
      is_active: true,
      sort_order: 70,
    },
    {
      title: "Competitions",
      slug: "competitions",
      description: "Qur'an · Tajweed · Arabic · Islamic Quiz",
      category: "Community",
      icon_name: "Award",
      is_active: true,
      sort_order: 80,
    },
  ];

  const { data, error } = await supabase
    .from("alif_programmes")
    .upsert(programs, { onConflict: "slug" });

  if (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
