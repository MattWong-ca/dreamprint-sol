"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
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

  if (!eventInfo) {
    notFound();
  }

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
        const imageIndex = (rowIndex * rowSize + i) % images.length;
        row.push(images[imageIndex]);
      }
      rows.push(row);
    }
    return rows;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading event photos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCollageImages}
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const imageRows = createImageRows();

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Back button */}
      <div className="absolute top-20 left-4 z-50">
        <button
          onClick={() => router.push('/events')}
          className="flex items-center space-x-2 bg-white bg-opacity-90 hover:bg-opacity-100 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-gray-700 font-medium">Back to Events</span>
        </button>
      </div>

      <div className="flex justify-center pt-24 mb-8">
        <h1 className="text-5xl font-bold text-black text-center">{eventInfo.name}</h1>
      </div>

      <div className="flex flex-col gap-8">
        {imageRows.length > 0 ? (
          imageRows.map((row, rowIndex) => (
            <div key={rowIndex} className="w-full">
              <Marquee
                direction={rowIndex % 2 === 0 ? "left" : "right"}
                speed={30 + rowIndex * 10}
                gradient={false}
                pauseOnHover={true}
              >
                {row.map((image, imageIndex) => (
                  <div
                    key={`${image.id}-${rowIndex}-${imageIndex}`}
                    className="mx-4 bg-white shadow-lg border border-gray-200 p-2 transform hover:scale-105 transition-transform duration-200 cursor-pointer"
                    style={{ width: '200px', height: '295px' }}
                    onClick={() => router.push(`/claim/${image.claim_id}`)}
                  >
                    <img
                      src={image.image_url}
                      alt={`Dreamprint ${image.claim_id}`}
                      className="w-full object-cover"
                      style={{ height: '240px' }}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </Marquee>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg">
              No photos yet. Be the first to opt in and share your Dreamprint!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
