"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function Navbar() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-montserrat-alternates)' }}>
          Dreamprint
        </Link>

        {/* Wallet button */}
        {connected && publicKey ? (
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors font-mono"
          >
            {publicKey.toString().slice(0, 4)}…{publicKey.toString().slice(-4)}
          </button>
        ) : (
          <button
            onClick={() => setVisible(true)}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            Connect wallet
          </button>
        )}
      </div>
    </header>
  );
}
