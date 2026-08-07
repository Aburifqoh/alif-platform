import { NextResponse } from "next/server";

export async function GET() {
  try {
    const city = "Abuja";
    const country = "Nigeria";
    const method = 3; // Muslim World League — standard for West Africa/Nigeria

    const res = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!res.ok) throw new Error("Failed to fetch prayer times");

    const data = await res.json();
    const timings = data.data.timings;
    const meta = data.data.meta;
    const date = data.data.date;

    return NextResponse.json({
      city,
      country,
      method: meta.method.name,
      date: date.readable,
      hijri: `${date.hijri.day} ${date.hijri.month.en} ${date.hijri.year}`,
      timings: {
        Fajr: timings.Fajr,
        Sunrise: timings.Sunrise,
        Dhuhr: timings.Dhuhr,
        Asr: timings.Asr,
        Maghrib: timings.Maghrib,
        Isha: timings.Isha,
        Juma: timings.Dhuhr, // Jumu'ah is typically around Dhuhr time
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch prayer times" },
      { status: 500 }
    );
  }
}
