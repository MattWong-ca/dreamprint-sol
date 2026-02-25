"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50 bg-white/70 backdrop-blur-md">
      <div className="container mx-auto px-6 flex items-center h-16 gap-10">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight shrink-0" style={{ fontFamily: 'var(--font-montserrat-alternates)' }}>
          Dreamprint
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-md font-medium flex-1" />

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
            Connect wallet
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200/50 bg-white/90 backdrop-blur-md px-6 py-4 flex flex-col gap-4 text-sm text-gray-600">
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors w-full">
            Book for event
          </button>
        </div>
      )}
    </header>
  );
}
