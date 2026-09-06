import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { updateOrderStatus } from "../../redux/ordersSlice";

const statuses = [
  { value: "pending", label: "নতুন" },
  { value: "confirmed", label: "নিশ্চিত" },
  { value: "completed", label: "সম্পন্ন" },
  { value: "cancelled", label: "বাতিল" },
];

export default function AdminOrderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const order = useSelector(s => s.orders.items.find(o => String(o.id) === String(id)));

  if (!order) {
    return (
      <div>
        <p className="text-gray-500">অর্ডার পাওয়া যায়নি</p>
        <Link to="/admin/orders" className="text-green-700 mt-3 inline-block">← অর্ডার তালিকায় ফিরুন</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/admin/orders" className="text-gray-600 hover:text-gray-900">← অর্ডার তালিকা</Link>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 mb-6">
        <h1 className="text-2xl font-semibold">অর্ডার #{order.id}</h1>
        <select
          value={order.status}
          onChange={e => dispatch(updateOrderStatus({ id: order.id, status: e.target.value })).unwrap().catch(err => alert(err.message))}
          className="border border-gray-300 rounded px-3 py-2 bg-white"
        >
          {statuses.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 text-sm space-y-2">
          <h2 className="font-semibold text-base mb-3">ক্রেতার তথ্য</h2>
          <p><span className="text-gray-500">নাম:</span> {order.buyerName}</p>
          <p><span className="text-gray-500">ফোন:</span> {order.buyerPhone}</p>
          <p><span className="text-gray-500">ঠিকানা:</span> {order.buyerAddress}</p>
          <p><span className="text-gray-500">লোকেশন:</span> {order.buyerLocation || "—"}</p>
          <p><span className="text-gray-500">তারিখ:</span> {new Date(order.createdAt).toLocaleString("bn-BD")}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 text-sm">
          <h2 className="font-semibold text-base mb-3">সারাংশ</h2>
          <p><span className="text-gray-500">আইটেম:</span> {order.items?.reduce((n, i) => n + i.qty, 0)}</p>
          <p className="text-lg font-semibold mt-2">মোট: ৳ {order.total}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 border-b bg-gray-50">
            <tr>
              <th className="p-3">পণ্য</th>
              <th>পরিমাণ</th>
              <th>দাম</th>
              <th className="pr-3">সাবটোটাল</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map(item => (
              <tr key={`${item.id}-${item.title}`} className="border-b last:border-0">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-12 h-12 object-cover rounded" />
                    ) : null}
                    {item.title}
                  </div>
                </td>
                <td>{item.qty}</td>
                <td>৳ {item.price}</td>
                <td className="pr-3">৳ {item.qty * item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
