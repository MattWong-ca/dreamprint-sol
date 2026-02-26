"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplCore, create } from "@metaplex-foundation/mpl-core";
import { generateSigner } from "@metaplex-foundation/umi";
import { DreamprintOrder, getOrderByClaimId, updateOrderStatus } from "@/lib/supabase";

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

export default function ClaimPage() {
  const params = useParams();
  const claimId = params.claimId as string;

  const wallet = useWallet();
  const { connection } = useConnection();

  const { publicKey, connected } = wallet;

  const [order, setOrder] = useState<DreamprintOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [minting, setMinting] = useState(false);
  const [mintError, setMintError] = useState("");
  const [mintedAddress, setMintedAddress] = useState("");

  useEffect(() => {
    if (claimId) fetchOrderDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await getOrderByClaimId(claimId);
      if (!data) throw new Error("Order not found");
      setOrder(data);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load claim details");
    } finally {
      setLoading(false);
    }
  };

  const handleMint = async () => {
    if (!connected || !publicKey) return;
    setMinting(true);
    setMintError("");

    try {
      const metadataUri = `${window.location.origin}/api/metadata/${claimId}`;

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

      const assetAddress = asset.publicKey.toString();
      setMintedAddress(assetAddress);

      await updateOrderStatus(claimId, { minted_status: true });
      setOrder((prev) => prev ? { ...prev, minted_status: true } : prev);
    } catch (err) {
      console.error("Mint failed:", err);
      setMintError(err instanceof Error ? err.message : "Mint failed");
    } finally {
      setMinting(false);
    }
  };

  const saveToPhotos = (imageUrl: string) => {
    if (!imageUrl) return;
    if (navigator.share && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      fetch(imageUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `dreamprint-${claimId}.jpg`, { type: "image/jpeg" });
          navigator.share({ title: "Dreamprint Artwork", files: [file] }).catch(() => fallbackDownload(imageUrl));
        })
        .catch(() => fallbackDownload(imageUrl));
    } else {
      fallbackDownload(imageUrl);
    }
  };

  const fallbackDownload = (imageUrl: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `dreamprint-${claimId}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        <GradientBg />
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        <GradientBg />
        <div className="relative z-10 text-center space-y-4">
          <p className="text-red-500">{error || "Claim not found"}</p>
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors text-sm"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <GradientBg />

      <div className="relative z-10 px-6 pt-28 pb-16 max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-montserrat-alternates)" }}
          >
            Your Dreamprint
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-mono">{claimId}</p>
        </div>

        {/* Image */}
        {order.image_url && (
          <div
            className="bg-white rounded-2xl shadow-xl overflow-hidden mx-auto mb-6"
            style={{ width: "240px", aspectRatio: "3/4" }}
          >
            <img
              src={order.image_url}
              alt="Dreamprint artwork"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Public in Album</span>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${order.collage_opt_in ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"}`}>
              {order.collage_opt_in ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Minted</span>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${order.minted_status ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"}`}>
              {order.minted_status ? "Yes" : "No"}
            </span>
          </div>
          {order.wallet_address && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Wallet</span>
              <span className="text-xs font-mono text-gray-700">
                {order.wallet_address.slice(0, 6)}…{order.wallet_address.slice(-4)}
              </span>
            </div>
          )}
        </div>

        {/* Mint section */}
        {!order.minted_status ? (
          <div className="space-y-3 mb-5">
            {!connected ? (
              <p className="text-sm text-gray-400 text-center py-1">
                Connect your wallet (top right) to mint
              </p>
            ) : (
              <>
                <button
                  onClick={handleMint}
                  disabled={minting}
                  className="w-full py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {minting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                      Minting…
                    </span>
                  ) : (
                    "Mint NFT"
                  )}
                </button>
                {mintError && (
                  <p className="text-red-500 text-xs text-center">{mintError}</p>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-5">
            <p className="text-indigo-600 font-medium text-sm mb-1">Already minted as NFT</p>
            <p className="text-indigo-400 text-xs">This artwork has been minted to the blockchain</p>
          </div>
        )}

        {/* Mint success */}
        {mintedAddress && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5">
            <p className="text-xs text-gray-400 mb-1">Asset Address</p>
            <p className="font-mono text-sm text-gray-700 break-all mb-3">{mintedAddress}</p>
            <a
              href={`https://explorer.solana.com/address/${mintedAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:underline"
            >
              View on Explorer →
            </a>
          </div>
        )}

        {/* Save to photos */}
        {order.image_url && (
          <button
            onClick={() => saveToPhotos(order.image_url!)}
            className="w-full py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors"
          >
            Save to Photos
          </button>
        )}

        <p className="mt-8 text-center text-xs text-gray-400">
          Share this link to show your Dreamprint
        </p>
      </div>
    </div>
  );
}
