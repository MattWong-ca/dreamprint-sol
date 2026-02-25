"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: (event: string, collageOptIn: boolean) => void;
  isCreating: boolean;
}

export default function NewSessionModal({ isOpen, onClose, onCreateSession, isCreating }: NewSessionModalProps) {
  const [event, setEvent] = useState("sol-demo");
  const [collageOptIn, setCollageOptIn] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (event.trim()) {
      onCreateSession(event.trim(), collageOptIn);
      setEvent("");
      setCollageOptIn(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setEvent("");
      setCollageOptIn(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-montserrat-alternates)' }}>
            New Session
          </h2>
          <button onClick={handleClose} disabled={isCreating} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="event" className="block text-sm font-medium text-gray-700 mb-1.5">
              Event ID
            </label>
            <input
              id="event"
              type="text"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              placeholder="e.g. htn-2025, ethglobal-sf-2025"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              required
              disabled={isCreating}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="collageOptIn"
              type="checkbox"
              checked={collageOptIn}
              onChange={(e) => setCollageOptIn(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-300"
              disabled={isCreating}
            />
            <label htmlFor="collageOptIn" className="text-sm text-gray-600">
              Feature in public album
            </label>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !event.trim()}
              className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
