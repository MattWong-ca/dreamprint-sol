"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAllOrders, DreamprintOrder, createNewSession } from "@/lib/supabase";
import { EVENTS } from "@/lib/events";
import NewSessionModal from "@/app/components/NewSessionModal";

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

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<DreamprintOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [eventFilter, setEventFilter] = useState("all");

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      fetchOrders();
    } else {
      setError("Invalid password");
      setPassword("");
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data || []);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (event: string, collageOptIn: boolean) => {
    try {
      setIsCreatingSession(true);
      setError("");
      await createNewSession(event, collageOptIn);
      setShowNewSessionModal(false);
      await fetchOrders();
    } catch (err) {
      console.error("Failed to create session:", err);
      setError("Failed to create new session");
    } finally {
      setIsCreatingSession(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString();

  const filteredOrders = eventFilter === "all"
    ? orders
    : orders.filter((o) => o.event === eventFilter);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        <GradientBg />
        <div className="relative z-10 w-full max-w-sm mx-auto px-6">
          <h1
            className="text-3xl font-bold text-gray-900 mb-1 text-center"
            style={{ fontFamily: 'var(--font-montserrat-alternates)' }}
          >
            Admin
          </h1>
          <p className="text-gray-500 text-center mb-8">Enter password to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
              required
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <GradientBg />

      <div className="relative z-10 px-6 pt-28 pb-16 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-4xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-montserrat-alternates)' }}
          >
            Orders
          </h1>
          <div className="flex gap-3">
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="all">All events</option>
              {EVENTS.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
            <button
              onClick={() => setShowNewSessionModal(true)}
              disabled={loading}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              New Session
            </button>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Claim ID", "Event", "Wallet", "Paid", "In Album", "Minted", "Created"].map((col) => (
                    <th key={col} className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => router.push(`/takephoto?claimId=${order.claim_id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-mono font-medium text-indigo-600">
                      {order.claim_id}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 font-medium">
                      {order.event || '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 font-mono">
                      {order.wallet_address
                        ? `${order.wallet_address.slice(0, 6)}…${order.wallet_address.slice(-4)}`
                        : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${order.paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {order.paid ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${order.collage_opt_in ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                        {order.collage_opt_in ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${order.minted_status ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                        {order.minted_status ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {order.created_at ? formatDate(order.created_at) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-400">No orders found</div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-indigo-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Loading orders...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <NewSessionModal
        isOpen={showNewSessionModal}
        onClose={() => setShowNewSessionModal(false)}
        onCreateSession={handleCreateSession}
        isCreating={isCreatingSession}
      />
    </div>
  );
}
