import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const products = useSelector(s => s.products.items);
  const { items: orders, status } = useSelector(s => s.orders);
  const revenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const pending = orders.filter(o => o.status === "pending").length;
  const recent = orders.slice(0, 5);

  const cards = [
    { label: "মোট পণ্য", value: products.length, to: "/admin/products" },
    { label: "মোট অর্ডার", value: orders.length, to: "/admin/orders" },
    { label: "নতুন অর্ডার", value: pending, to: "/admin/orders" },
    { label: "মোট বিক্রি", value: `৳ ${revenue}`, to: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">ড্যাশবোর্ড</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <Link key={c.label} to={c.to} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-2xl font-semibold mt-1">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">সাম্প্রতিক অর্ডার</h2>
          <Link to="/admin/orders" className="text-sm text-green-700">সব দেখুন</Link>
        </div>

        {status === "loading" ? (
          <p className="text-gray-500 text-sm">অর্ডার লোড হচ্ছে...</p>
        ) : recent.length === 0 ? (
          <p className="text-gray-500 text-sm">এখনো কোনো অর্ডার নেই</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="py-2">ক্রেতা</th>
                  <th>ফোন</th>
                  <th>মোট</th>
                  <th>স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(o => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-2">{o.buyerName}</td>
                    <td>{o.buyerPhone}</td>
                    <td>৳ {o.total}</td>
                    <td>{statusLabel(o.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function statusLabel(status) {
  return { pending: "নতুন", confirmed: "নিশ্চিত", completed: "সম্পন্ন", cancelled: "বাতিল" }[status] || status;
}
