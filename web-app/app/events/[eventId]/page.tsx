"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getEventById } from "@/lib/events";
import Marquee from "react-fast-marquee";

interface CollageImage {
  id: number;
  image_url: string;
  claim_id: string;
}

export default function EventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const [images, setImages] = useState<CollageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const eventInfo = getEventById(eventId);

  if (!eventInfo) notFound();

  useEffect(() => {
    fetchCollageImages();
  }, [eventId]);

  const fetchCollageImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dreamprint_orders')
        .select('id, image_url, claim_id')
        .eq('collage_opt_in', true)
        .eq('event', eventId)
        .not('image_url', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      console.error("Error fetching collage images:", err);
      setError("Failed to load collage images");
    } finally {
      setLoading(false);
    }
  };

  const createImageRows = () => {
    if (images.length === 0) return [];
    const rowSize = 10;
    const rows = [];
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      const row = [];
      for (let i = 0; i < rowSize; i++) {
        row.push(images[(rowIndex * rowSize + i) % images.length]);
      }
      rows.push(row);
    }
    return rows;
  };

  const gradient = (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 -left-20 w-[900px] h-[350px] bg-blue-400/30 rounded-full blur-3xl" />
      <div className="absolute top-1/4 -right-20 w-[900px] h-[350px] bg-purple-400/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-[900px] h-[350px] bg-pink-400/30 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-[800px] h-[300px] bg-cyan-400/25 rounded-full blur-3xl" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.35]" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        {gradient}
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading photos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        {gradient}
        <div className="relative z-10 text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <button onClick={fetchCollageImages} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const imageRows = createImageRows();

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {gradient}

      {/* Back button */}
      <div className="relative z-10 pt-24 px-6 mb-8">
        <div className="container mx-auto">
          <button
            onClick={() => router.push('/events')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>

          <h1
            className="text-5xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-montserrat-alternates)' }}
          >
            {eventInfo!.name}
          </h1>
          <p className="text-gray-500 mt-2">{eventInfo!.date}</p>
        </div>
      </div>

      {/* Marquee rows */}
      <div className="relative z-10 flex flex-col gap-6 pb-16">
        {imageRows.length > 0 ? (
          imageRows.map((row, rowIndex) => (
            <Marquee
              key={rowIndex}
              direction={rowIndex % 2 === 0 ? "left" : "right"}
              speed={25 + rowIndex * 8}
              gradient={false}
              pauseOnHover={true}
            >
              {row.map((image, imageIndex) => (
                <div
                  key={`${image.id}-${rowIndex}-${imageIndex}`}
                  className="mx-3 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer"
                  style={{ width: '130px', height: '185px' }}
                  onClick={() => router.push(`/claim/${image.claim_id}`)}
                >
                  <img
                    src={image.image_url}
                    alt={`Dreamprint ${image.claim_id}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
              ))}
            </Marquee>
          ))
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">No photos yet — be the first to share your Dreamprint!</p>
          </div>
        )}
      </div>
    </div>
  );
}
