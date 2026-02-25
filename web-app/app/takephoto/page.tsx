"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { updateOrderStatus } from "@/lib/supabase";
import QRPopup from "@/app/components/QRPopup";

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

function TakePhotoContent() {
  const searchParams = useSearchParams();
  const claimId = searchParams.get('claimId');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<"upload" | "processing" | "actions">("upload");
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [isSavingToDB, setIsSavingToDB] = useState(false);
  const [showQRPopup, setShowQRPopup] = useState(false);

  useEffect(() => {
    setLoading(false);
    if (!claimId) setError("No claim ID provided");
  }, [claimId]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('File size must be less than 10MB'); return; }
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setPhotoUploaded(true);
    };
    reader.readAsDataURL(file);
  };

  const retakePhoto = () => {
    setPhotoUploaded(false);
    setUploadedImage("");
    setCurrentStep("upload");
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const compressImage = (dataUrl: string, maxWidth = 1024, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = dataUrl;
    });
  };

  const handleAIEdit = async () => {
    try {
      setIsProcessingAI(true);
      setCurrentStep("processing");
      const compressedImage = await compressImage(uploadedImage);
      const prompt = "Turn this photo into a soft pastel cartoon portrait inspired by Studio Ghibli, featuring a Roman-style laurel wreath in the back and warm Italian sunlight. Use watercolor-like brushstrokes and light blue background with soft clouds.";
      const response = await fetch('/api/ai-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: compressedImage, prompt }),
      });
      if (!response.ok) throw new Error('Failed to process AI edit');
      const result = await response.json();
      if (result.editedImageUrl) {
        setUploadedImage(result.editedImageUrl);
        setCurrentStep("actions");
      } else {
        throw new Error('No edited image URL received');
      }
    } catch (err) {
      console.error('Error during AI edit:', err);
      setError('Failed to process AI edit. Please try again.');
      setCurrentStep("upload");
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleSaveToDatabase = async () => {
    try {
      setIsSavingToDB(true);
      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: uploadedImage, claimId }),
      });
      if (!uploadResponse.ok) throw new Error('Failed to upload image');
      const uploadResult = await uploadResponse.json();
      await updateOrderStatus(claimId!, { image_url: uploadResult.imageUrl, minted_status: false });
      alert("✅ Image saved successfully!");
    } catch (err) {
      console.error("Error saving image:", err);
      setError('Failed to save image. Please try again.');
    } finally {
      setIsSavingToDB(false);
    }
  };

  const saveToPhotos = () => {
    if (!uploadedImage) return;
    if (navigator.share && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      fetch(uploadedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `dreamprint-${claimId}.jpg`, { type: 'image/jpeg' });
          navigator.share({ title: 'Dreamprint Artwork', files: [file] }).catch(fallbackDownload);
        })
        .catch(fallbackDownload);
    } else {
      fallbackDownload();
    }
  };

  const fallbackDownload = () => {
    if (!uploadedImage) return;
    const link = document.createElement('a');
    link.href = uploadedImage;
    link.download = `dreamprint-${claimId}.jpg`;
    link.target = '_blank';
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

  if (error || !claimId) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        <GradientBg />
        <div className="relative z-10 text-center space-y-2">
          <p className="text-red-500">{error || "Invalid claim ID"}</p>
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
            style={{ fontFamily: 'var(--font-montserrat-alternates)' }}
          >
            Take Photo
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-mono">{claimId}</p>
        </div>

        {/* Image area */}
        <div
          className="mx-auto mb-6 overflow-hidden rounded-2xl"
          style={{ width: '240px', aspectRatio: '3/4' }}
        >
          {!photoUploaded ? (
            <div className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3">
              <span className="text-4xl">📷</span>
              <p className="text-sm text-gray-400 text-center px-4">Select a photo from your camera roll</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors"
              >
                Choose Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                capture="environment"
              />
            </div>
          ) : (
            <img src={uploadedImage} alt="Uploaded photo" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* Controls */}
        {photoUploaded && (
          <div className="space-y-3">
            {currentStep === "upload" && (
              <div className="flex gap-3">
                <button
                  onClick={handleAIEdit}
                  disabled={isProcessingAI}
                  className="flex-[3] py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  ✨ AI Edit
                </button>
                <button
                  onClick={retakePhoto}
                  disabled={isProcessingAI}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  📁
                </button>
              </div>
            )}

            {currentStep === "processing" && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-indigo-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Transforming with AI...</p>
              </div>
            )}

            {currentStep === "actions" && (
              <div className="space-y-2">
                <button
                  onClick={handleSaveToDatabase}
                  disabled={isSavingToDB}
                  className="w-full py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {isSavingToDB ? "Saving..." : "🔗 Make Public URL"}
                </button>
                <button
                  onClick={saveToPhotos}
                  className="w-full py-2.5 border border-gray-200 text-gray-700 text-sm rounded-xl hover:bg-gray-50 transition-colors"
                >
                  📱 Save to Camera Roll
                </button>
                <button
                  onClick={() => setShowQRPopup(true)}
                  className="w-full py-2.5 border border-gray-200 text-gray-700 text-sm rounded-xl hover:bg-gray-50 transition-colors"
                >
                  📋 Show QR Code
                </button>
                <button
                  onClick={retakePhoto}
                  className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Retake
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <QRPopup
        isOpen={showQRPopup}
        onClose={() => setShowQRPopup(false)}
        claimId={claimId}
      />
    </div>
  );
}

export default function TakePhotoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <TakePhotoContent />
    </Suspense>
  );
}
