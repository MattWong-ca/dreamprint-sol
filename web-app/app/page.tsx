import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import FadeIn from "./components/FadeIn";

export default function Home() {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
        {/* Gradient Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-20 w-[900px] h-[350px] bg-blue-400/30 rounded-full blur-3xl" />
          <div className="absolute top-1/4 -right-20 w-[900px] h-[350px] bg-purple-400/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-[900px] h-[350px] bg-pink-400/30 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-[800px] h-[300px] bg-cyan-400/25 rounded-full blur-3xl" />
          {/* Grain overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 z-10">
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight bg-indigo-700 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-montserrat-alternates)' }}>
              Dreamprint
            </h1>
            <p className="text-xl font-medium max-w-lg -mt-2">
              NFT polaroids for events: snap a pic, AI transform, and instantly print for attendees!
            </p>
            <div className="flex gap-4 pt-4">
              <a href="https://t.me/mattwong_ca" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2 group">
                Book for event
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                href="/events"
                className="px-6 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all text-gray-700"
              >
                View showcase
              </Link>
            </div>
          </div>

          {/* Right Image - Polaroids Grid */}
          <div className="relative h-[600px] hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 via-purple-400/50 to-pink-400/50 blur-3xl" />
            <div className="relative flex gap-3 p-14 -mt-24">
              {/* Left column */}
              <div className="flex flex-col gap-3 flex-1">
                {["one.JPG", "3.JPG"].map((src, i) => (
                  <div key={i} className="relative aspect-[3/4] rounded-xl shadow-xl overflow-hidden bg-gray-100 hover:scale-105 transition-transform">
                    <Image src={`/${src}`} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
              {/* Right column — shifted down */}
              <div className="flex flex-col gap-3 flex-1 mt-7">
                {["two.jpg", "four.JPG"].map((src, i) => (
                  <div key={i} className="relative aspect-[3/4] rounded-xl shadow-xl overflow-hidden bg-gray-100 hover:scale-105 transition-transform">
                    <Image src={`/${src}`} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* As Seen At */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6" style={{ fontFamily: 'var(--font-montserrat-alternates)' }}>
            As seen at
          </p>
          <div className="flex items-center justify-center gap-16">
            <div className="relative w-44 h-20">
              <Image src="/ethglobalnyc.png" alt="ETHGlobal NYC" fill className="object-contain" />
            </div>
            {/* Hack the North */}
            <div className="flex items-center gap-3 h-20">
              <div className="relative w-16 h-16 shrink-0">
                <Image src="/htn.jpeg" alt="Hack the North" fill className="object-contain rounded" />
              </div>
              <span className="text-3xl font-black text-gray-800 leading-tight">Hack the North</span>
            </div>
            <div className="relative w-44 h-20">
              <Image src="/ethrome.png" alt="ETHRome" fill className="object-contain invert" />
            </div>
          </div>
        </div>
      </section>

      {/* Why organizers love Dreamprint */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <FadeIn direction="left">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold leading-tight text-indigo-700" style={{ fontFamily: 'var(--font-montserrat-alternates)' }}>
                  Event hosts love Dreamprint
                </h2>
                <ul className="space-y-4 text-lg">
                  {[
                    "Collectible artwork tailored to any artist's style",
                    "Memorable, low-cost, and high-engagement",
                    "Increased social visibility via share-worthy photos",
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-indigo-500 mt-1 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative aspect-[4/3] bg-gray-200 rounded-2xl overflow-hidden" />
            </div>
          </FadeIn>
        </div>
      </section>
      {/* Organizers section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <FadeIn direction="right">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="relative aspect-[4/3] bg-gray-200 rounded-2xl overflow-hidden" />
              <div className="space-y-6">
                <h2 className="text-4xl font-bold leading-tight text-indigo-700" style={{ fontFamily: 'var(--font-montserrat-alternates)' }}>
                  Collectors become Creators
                </h2>
                <ul className="space-y-4 text-lg">
                  {[
                    "Mint as NFTs, curate as galleries on Exchange Art",
                    "Onboard users to new ecosystems + increase mint volume",
                    "Be a part of long-term communities",
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-indigo-500 mt-1 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
