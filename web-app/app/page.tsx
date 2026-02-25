import Link from "next/link";
import Image from "next/image";
import { Sparkles, Camera, Zap, Gift, ArrowRight } from "lucide-react";

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
              <a href="https://t.me/mattwong_ca" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2 group">
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

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Camera,
                title: "Capture",
                description: "Guests snap photos at your event booth"
              },
              {
                icon: Sparkles,
                title: "Transform",
                description: "AI generates unique artistic versions instantly"
              },
              {
                icon: Zap,
                title: "Print",
                description: "Instant polaroid prints as physical souvenirs"
              },
              {
                icon: Gift,
                title: "Mint",
                description: "NFTs created for digital collectibles"
              }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex w-16 h-16 items-center justify-center rounded-full bg-gray-100 border border-gray-200">
                  <step.icon className="w-7 h-7 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Perfect for Your Event</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Unique Guest Experience",
                description: "Give attendees something memorable - AI art they can take home and treasure"
              },
              {
                title: "Social Media Ready",
                description: "Guests share their unique polaroids, creating organic buzz for your event"
              },
              {
                title: "Custom Branding",
                description: "Tailor AI styles and frames to perfectly match your event theme"
              },
              {
                title: "Web3 Native",
                description: "NFTs provide proof of attendance on the blockchain"
              },
              {
                title: "Quick Setup",
                description: "Full booth ready in under 2 hours with minimal space required"
              },
              {
                title: "Real-time Gallery",
                description: "Display all generated photos on screens throughout your venue"
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all">
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
