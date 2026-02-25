"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-montserrat-alternates)' }}>
          Dreamprint
        </Link>

        {/* Connect wallet */}
        <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
          Connect wallet
        </button>
      </div>
    </header>
  );
}
