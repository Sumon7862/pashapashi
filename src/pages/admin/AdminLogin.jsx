import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import logo from "../../assets/favicon.png";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { isAdmin, loading, configured, login, logout } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">লোড হচ্ছে...</div>;
  }

  if (isAdmin) return <Navigate to="/admin" replace />;

  const onSubmit = async e => {
    e.preventDefault();
    if (!configured) {
      setError("Supabase এখনো সেটআপ হয়নি। .env ফাইল দেখুন।");
      return;
    }
    setSubmitting(true);
    setError("");
    const { data, error: authError } = await login(email, pass);
    setSubmitting(false);
    if (authError) {
      setError("ভুল ইমেইল বা পাসওয়ার্ড");
      return;
    }
    const adminId = import.meta.env.VITE_ADMIN_USER_ID;
    if (adminId && data?.user?.id !== adminId) {
      await logout();
      setError("এই অ্যাকাউন্টে অ্যাডমিন অ্যাক্সেস নেই");
      return;
    }
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="bg-white w-full max-w-sm rounded-xl shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
          <h1 className="text-xl font-semibold mt-2">অ্যাডমিন লগইন</h1>
          <p className="text-sm text-gray-500">পাশাপাশি প্যানেল</p>
        </div>

        {!configured && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-4">
            `.env` এ `VITE_SUPABASE_URL` ও `VITE_SUPABASE_ANON_KEY` বসান।
          </p>
        )}

        <label className="text-sm text-gray-600">ইমেইল</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-green-600"
          autoComplete="username"
          required
        />

        <label className="text-sm text-gray-600">পাসওয়ার্ড</label>
        <input
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
          autoComplete="current-password"
          required
        />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
        >
          {submitting ? "যাচাই হচ্ছে..." : "প্রবেশ করুন"}
        </button>
      </form>
    </div>
  );
}
