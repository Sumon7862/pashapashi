import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { inc, dec, removeFromCart, clear } from "../redux/cartSlice";
import { addOrder } from "../redux/ordersSlice";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { items } = useSelector(s => s.cart);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerLocation, setBuyerLocation] = useState("");

  const sendOrder = async e => {
    e.preventDefault();
    if (!buyerName || !buyerPhone || !buyerAddress) {
      alert("দয়া করে নাম, ফোন নম্বর এবং ঠিকানা পূরণ করুন");
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(addOrder({
        status: "pending",
        buyerName,
        buyerPhone,
        buyerAddress,
        buyerLocation,
        items: items.map(i => ({
          id: i.id,
          title: i.title,
          qty: i.qty,
          price: i.price,
          image: i.images?.[0] || "",
        })),
        total,
      })).unwrap();

      const orderMsg = items.map(i => `${i.title} x ${i.qty}`).join("\n");
      let message = `নতুন অর্ডার\n${orderMsg}\nমোট: ৳ ${total}\n\n`;
      message += `Buyer: ${buyerName}\nPhone: ${buyerPhone}\nAddress: ${buyerAddress}`;
      if (buyerLocation) message += `\nLive Location: ${buyerLocation}`;

      window.open(`https://wa.me/8801937952527?text=${encodeURIComponent(message)}`);
      dispatch(clear());
      setShowForm(false);
      setBuyerName("");
      setBuyerPhone("");
      setBuyerAddress("");
      setBuyerLocation("");
    } catch (err) {
      alert(err.message || "অর্ডার সেভ হয়নি। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 sm:mt-28 px-3 sm:px-4 pb-8">
      <button onClick={() => nav(-1)} className="mb-4 text-gray-700 hover:text-gray-900">
        ← পেছনে
      </button>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">আপনার কার্ট খালি</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mt-4">
          {items.map(i => (
            <div key={i.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-3 border-b">
              <span className="font-medium break-words">{i.title}</span>
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => dispatch(dec(i.id))} className="px-3 py-1 bg-gray-200 rounded">-</button>
                  <span>{i.qty}</span>
                  <button onClick={() => dispatch(inc(i.id))} className="px-3 py-1 bg-gray-200 rounded">+</button>
                </div>
                <span className="whitespace-nowrap">৳ {i.qty * i.price}</span>
                <button onClick={() => dispatch(removeFromCart(i.id))} className="text-red-500 font-bold px-2">✕</button>
              </div>
            </div>
          ))}

          <div className="mt-6 text-left sm:text-right">
            <p className="font-semibold">মোট: ৳ {total}</p>
            <p className="text-sm text-gray-500 mb-3">
              ডেলিভারির আগে আমরা আপনার অর্ডার WhatsApp-এর মাধ্যমে নিশ্চিত করব
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto bg-green-600 text-white px-6 py-2.5 rounded hover:bg-green-700 transition"
            >
              অর্ডার নিশ্চিত করুন
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-xl sm:rounded-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">অর্ডার ফর্ম</h2>
            <form onSubmit={sendOrder} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="আপনার নাম"
                value={buyerName}
                onChange={e => setBuyerName(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <input
                type="tel"
                placeholder="ফোন নম্বর"
                value={buyerPhone}
                onChange={e => setBuyerPhone(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <textarea
                placeholder="ঠিকানা"
                value={buyerAddress}
                onChange={e => setBuyerAddress(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <input
                type="text"
                placeholder="লাইভ লোকেশন লিঙ্ক (ঐচ্ছিক)"
                value={buyerLocation}
                onChange={e => setBuyerLocation(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 text-white px-4 py-2.5 rounded hover:bg-green-700 transition disabled:opacity-60"
              >
                {submitting ? "পাঠানো হচ্ছে..." : "অর্ডার পাঠান"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
