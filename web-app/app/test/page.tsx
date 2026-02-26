"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplCore, create } from "@metaplex-foundation/mpl-core";
import { generateSigner } from "@metaplex-foundation/umi";

const GradientBg = () => (
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

export default function TestPage() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const { publicKey, connected, disconnect } = wallet;

  const [claimId, setClaimId] = useState("");
  const [minting, setMinting] = useState(false);
  const [result, setResult] = useState<{ assetAddress: string } | null>(null);
  const [error, setError] = useState("");

  const metadataUri = claimId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/api/metadata/${claimId}`
    : "";

  const handleMint = async () => {
    if (!connected || !publicKey) return;
    setMinting(true);
    setError("");
    setResult(null);

    try {
      const umi = createUmi(connection.rpcEndpoint)
        .use(mplCore())
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .use(walletAdapterIdentity(wallet as any));

      const asset = generateSigner(umi);

      await create(umi, {
        asset,
        name: "Dreamprint",
        uri: metadataUri,
      }).sendAndConfirm(umi);

      setResult({ assetAddress: asset.publicKey.toString() });
    } catch (err) {
      console.error("Mint failed:", err);
      setError(err instanceof Error ? err.message : "Mint failed");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <GradientBg />

      <div className="relative z-10 px-6 pt-28 pb-16 max-w-lg mx-auto">
        <div className="mb-8">
          <h1
            className="text-4xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-montserrat-alternates)" }}
          >
            Test Mint
          </h1>
          <p className="text-sm text-gray-400 mt-1">Solana devnet</p>
        </div>

        {/* Wallet */}
        {!connected ? (
          <button
            onClick={() => setVisible(true)}
            className="w-full py-3 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors mb-6"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400 mb-1">Connected</p>
                <p className="font-mono text-sm text-gray-700">
                  {publicKey!.toString().slice(0, 8)}…{publicKey!.toString().slice(-4)}
                </p>
              </div>
              <button
                onClick={() => disconnect()}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}

        {/* Claim ID input */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 space-y-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider">NFT Details</p>
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Claim ID</label>
            <input
              type="text"
              value={claimId}
              onChange={(e) => { setClaimId(e.target.value); setResult(null); setError(""); }}
              placeholder="e.g. ABC123"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          {metadataUri && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Metadata URI</span>
              <a
                href={metadataUri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 text-xs font-mono truncate max-w-[200px] hover:underline"
              >
                /api/metadata/{claimId}
              </a>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Network</span>
            <span className="text-indigo-600 font-medium">Devnet</span>
          </div>
        </div>

        {/* Mint button */}
        {connected && (
          <button
            onClick={handleMint}
            disabled={minting || !claimId.trim()}
            className="w-full py-3 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 mb-4"
          >
            {minting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                Minting…
              </span>
            ) : (
              "Mint Test NFT"
            )}
          </button>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl">
            <p className="text-indigo-600 font-medium mb-3">Minted successfully!</p>
            <p className="text-xs text-gray-400 mb-1">Asset Address</p>
            <p className="font-mono text-sm text-gray-700 break-all mb-4">{result.assetAddress}</p>
            <a
              href={`https://explorer.solana.com/address/${result.assetAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:underline"
            >
              View on Solana Explorer →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
