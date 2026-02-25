"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";

interface QRPopupProps {
  isOpen: boolean;
  onClose: () => void;
  claimId: string;
}

export default function QRPopup({ isOpen, onClose, claimId }: QRPopupProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const claimUrl = `${window.location.origin}/claim/${claimId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(claimUrl)}&bgcolor=255-255-255&color=0-0-0&format=png`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(claimUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-montserrat-alternates)' }}>
            Scan QR Code
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-5">
          <div className="p-3 border border-gray-100 rounded-xl bg-white">
            <img src={qrCodeUrl} alt="QR Code" className="w-[200px] h-[200px]" />
          </div>
        </div>

        <p className="text-sm text-gray-500 text-center mb-4">
          Scan to view this Dreamprint online
        </p>

        {/* URL + Copy */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 mb-5">
          <span className="text-xs text-gray-400 font-mono truncate flex-1">{claimUrl}</span>
          <button
            onClick={copyToClipboard}
            className="shrink-0 p-1 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
