import { useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminSettings() {
  const { session, changePassword } = useAdminAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async e => {
    e.preventDefault();
    setError("");
    setOk("");

    if (next.length < 6) {
      setError("নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে");
      return;
    }
    if (next !== confirm) {
      setError("নতুন পাসওয়ার্ড দুইবার একই দিন");
      return;
    }

    setSaving(true);
    const { error: authError } = await changePassword(current, next);
    setSaving(false);

    if (authError) {
      setError(authError.message || "পাসওয়ার্ড বদলানো যায়নি");
      return;
    }

    setCurrent("");
    setNext("");
    setConfirm("");
    setOk("পাসওয়ার্ড পরিবর্তন হয়েছে");
  };

  return (
    <div className="max-w-md">
      <h1 className="text-xl sm:text-2xl font-semibold mb-2">সেটিংস</h1>
      <p className="text-sm text-gray-500 mb-6 break-all">{session?.user?.email}</p>

      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-semibold mb-4">পাসওয়ার্ড পরিবর্তন</h2>

        <label className="text-sm text-gray-600">বর্তমান পাসওয়ার্ড</label>
        <input
          type="password"
          value={current}
          onChange={e => setCurrent(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 mb-3"
          required
        />

        <label className="text-sm text-gray-600">নতুন পাসওয়ার্ড</label>
        <input
          type="password"
          value={next}
          onChange={e => setNext(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 mb-3"
          required
        />

        <label className="text-sm text-gray-600">নতুন পাসওয়ার্ড আবার</label>
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 mb-4"
          required
        />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {ok && <p className="text-green-700 text-sm mb-3">{ok}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
        >
          {saving ? "সংরক্ষণ হচ্ছে..." : "পাসওয়ার্ড সেভ করুন"}
        </button>
      </form>
    </div>
  );
}
