"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { EVENTS, EventInfo } from "@/lib/events";

export default function EventsPage() {
  const router = useRouter();
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventCounts();
  }, []);

  const fetchEventCounts = async () => {
    try {
      setLoading(true);
      const counts: Record<string, number> = {};

      for (const event of EVENTS) {
        const { count, error } = await supabase
          .from('dreamprint_orders')
          .select('*', { count: 'exact', head: true })
          .eq('collage_opt_in', true)
          .eq('event', event.id)
          .not('image_url', 'is', null);

        if (!error) counts[event.id] = count || 0;
      }

      setEventCounts(counts);
    } catch (err) {
      console.error("Error fetching event counts:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 px-6 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-20 w-[900px] h-[350px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-20 w-[900px] h-[350px] bg-purple-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[900px] h-[350px] bg-pink-400/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[800px] h-[300px] bg-cyan-400/25 rounded-full blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>
      <div className="container mx-auto max-w-3xl py-12 space-y-4 relative z-10">
        <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-montserrat-alternates)' }}>
          Events
        </h1>
        <hr className="border-black" />
        {EVENTS.map((event: EventInfo) => (
          <div
            key={event.id}
            onClick={() => router.push(`/events/${event.id}`)}
            className="group cursor-pointer border border-black rounded-2xl overflow-hidden bg-white hover:border-black hover:shadow-md transition-all duration-200 flex h-40"
          >
            {/* Image */}
            <div className="relative w-48 shrink-0">
              {event.image ? (
                <Image src={event.image} alt={event.name} fill className="object-cover" style={{ objectPosition: event.imagePosition || 'center' }} />
              ) : (
                <div className="absolute inset-0" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="hidden md:block text-xs text-gray-400 font-medium uppercase tracking-widest">
                  {event.date} &middot;{" "}
                  {loading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    `${eventCounts[event.id] || 0} photos`
                  )}
                </div>
                <h2
                  className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors"
                  style={{ fontFamily: 'var(--font-montserrat-alternates)' }}
                >
                  {event.name}
                </h2>
                <p className="text-sm text-gray-500">{event.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
