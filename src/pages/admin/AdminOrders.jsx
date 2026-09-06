import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const statusLabel = {
  pending: "নতুন",
  confirmed: "নিশ্চিত",
  completed: "সম্পন্ন",
  cancelled: "বাতিল",
};

export default function AdminOrders() {
  const { items: orders, status } = useSelector(s => s.orders);
  const [query, setQuery] = useState("");

  const filtered = orders.filter(o =>
    [o.buyerName, o.buyerPhone, o.buyerAddress, String(o.id)]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">অর্ডারসমূহ</h1>

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="নাম, ফোন বা অর্ডার আইডি..."
        className="w-full max-w-sm border border-gray-300 rounded px-3 py-2 mb-4 bg-white"
      />

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 border-b bg-gray-50">
            <tr>
              <th className="p-3">অর্ডার</th>
              <th>তারিখ</th>
              <th>ক্রেতা</th>
              <th>ফোন</th>
              <th>আইটেম</th>
              <th>মোট</th>
              <th>স্ট্যাটাস</th>
              <th className="pr-3"></th>
            </tr>
          </thead>
          <tbody>
            {status === "loading" ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">অর্ডার লোড হচ্ছে...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">কোনো অর্ডার নেই</td>
              </tr>
            ) : filtered.map(o => (
              <tr key={o.id} className="border-b last:border-0">
                <td className="p-3 font-medium">#{o.id}</td>
                <td>{formatDate(o.createdAt)}</td>
                <td>{o.buyerName}</td>
                <td>{o.buyerPhone}</td>
                <td>{o.items?.reduce((n, i) => n + i.qty, 0) || 0}</td>
                <td>৳ {o.total}</td>
                <td>{statusLabel[o.status] || o.status}</td>
                <td className="pr-3">
                  <Link to={`/admin/orders/${o.id}`} className="text-green-700 hover:underline">বিস্তারিত</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("bn-BD");
}
