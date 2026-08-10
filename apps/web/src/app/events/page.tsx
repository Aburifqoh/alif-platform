import React from "react";
import { createClient } from "@alif/database/server";
import { Calendar, MapPin, Clock, Video, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Events | ALIF",
  description: "Stay updated with lectures, seminars, Da'wah programs, and community events hosted by Al-Ibaanah Islamic Foundation.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const supabase = await createClient();

  // Fetch published events
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("start_datetime", { ascending: true });

  const eventList = events || [];
  const now = new Date();

  // Split into upcoming and past events
  const upcomingEvents = eventList.filter(
    (event) => new Date(event.start_datetime) >= now
  );
  const pastEvents = eventList.filter(
    (event) => new Date(event.start_datetime) < now
  ).reverse(); // Past events newest first

  return (
    <div className="min-h-screen bg-[#faf6ef] dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 pb-20">
      {/* Hero / Header */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-brand-charcoal via-[#24465B] to-brand-blue-dark text-white">
        <div className="absolute inset-0 opacity-[0.05]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="eventsPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#eventsPattern)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold font-[Outfit] tracking-tight">News &amp; Events</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg">
            Stay updated with educational lectures, seminars, outreaches, and communal events propagating authentic Islam.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* Upcoming Events Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-200 dark:border-white/10 pb-4">
            <div className="p-2.5 bg-[#b8860b]/10 text-[#b8860b] dark:text-[#d4a017] rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-[Outfit]">Upcoming Events</h2>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-sm">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No upcoming events scheduled at the moment.</p>
              <p className="text-xs text-gray-400 mt-1">Please check back later or subscribe to our newsletter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} isUpcoming={true} />
              ))}
            </div>
          )}
        </section>

        {/* Past Events Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-200 dark:border-white/10 pb-4">
            <div className="p-2.5 bg-gray-500/10 text-gray-500 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-[Outfit] text-gray-700 dark:text-gray-300">Past Events</h2>
          </div>

          {pastEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No past events recorded.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} isUpcoming={false} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function EventCard({ event, isUpcoming }: { event: any; isUpcoming: boolean }) {
  const startDate = new Date(event.start_datetime);
  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col h-full">
      {/* Event Header Image/Placeholder */}
      <div className="relative h-48 w-full bg-gradient-to-br from-[#24465B] to-brand-charcoal flex items-center justify-center p-6 text-center overflow-hidden">
        {event.cover_image ? (
          <img
            src={event.cover_image}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#b8860b]/20 to-[#24465B]/20 mix-blend-overlay" />
        )}
        <span className="relative z-10 px-3.5 py-1.5 bg-white/10 backdrop-blur-md border border-white/25 rounded-full text-xs font-semibold text-white tracking-wider uppercase font-[Outfit]">
          {event.event_type || "Lecture"}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <h3 className="font-bold text-lg font-[Outfit] text-gray-900 dark:text-white line-clamp-2">
            {event.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">
            {event.description || "No description provided."}
          </p>
        </div>

        <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-white/5 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#b8860b] shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#b8860b] shrink-0" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2">
            {event.is_online ? (
              <>
                <Video className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-green-600 dark:text-green-400 font-semibold">Online Event</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 text-[#b8860b] shrink-0" />
                <span className="line-clamp-1">{event.location || "To Be Announced"}</span>
              </>
            )}
          </div>
        </div>

        {isUpcoming && (
          <div className="pt-2">
            {event.is_online && event.meeting_link ? (
              <a
                href={event.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#b8860b] hover:bg-[#b8860b]/90 text-white text-xs font-semibold rounded-xl transition-all"
              >
                Join Stream <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : event.registration_required ? (
              <Link
                href={`/portal/events/register/${event.id}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-semibold rounded-xl transition-all"
              >
                Register Now
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
