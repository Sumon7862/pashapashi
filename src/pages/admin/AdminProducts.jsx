import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addProduct, deleteProduct } from "../../redux/productsSlice";
import { uploadProductImage } from "../../lib/storage";

const emptyForm = {
  title: "",
  category: "grocery",
  price: "",
  oldPrice: "",
  weight: "",
  description: "",
  imagesText: "",
};

export default function AdminProducts() {
  const products = useSelector(s => s.products.items);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = products.filter(p =>
    [p.title, p.category, p.description].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim() || !form.price) {
      alert("পণ্যের নাম এবং দাম প্রয়োজন");
      return;
    }

    setSaving(true);
    try {
      const fromUrls = form.imagesText
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean);
      const uploaded = files.length
        ? await Promise.all([...files].map(uploadProductImage))
        : [];
      const images = [...uploaded, ...fromUrls];

      await dispatch(addProduct({
        title: form.title.trim(),
        category: form.category.trim() || "grocery",
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        weight: form.weight.trim(),
        description: form.description.trim(),
        images: images.length ? images : ["https://images.unsplash.com/photo-1542838132-92c53300491e"],
      })).unwrap();

      setForm(emptyForm);
      setFiles([]);
      setShowForm(false);
    } catch (err) {
      alert(err.message || "পণ্য সেভ হয়নি");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id, title) => {
    if (!window.confirm(`"${title}" মুছে ফেলতে চান?`)) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
    } catch (err) {
      alert(err.message || "পণ্য মুছা যায়নি");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-semibold">পণ্যসমূহ</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + পণ্য যোগ করুন
        </button>
      </div>

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="পণ্য খুঁজুন..."
        className="w-full max-w-sm border border-gray-300 rounded px-3 py-2 mb-4 bg-white"
      />

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 border-b bg-gray-50">
            <tr>
              <th className="p-3">ছবি</th>
              <th>নাম</th>
              <th>ক্যাটাগরি</th>
              <th>দাম</th>
              <th>ওজন</th>
              <th className="pr-3">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">কোনো পণ্য নেই</td>
              </tr>
            ) : filtered.map(p => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="p-3">
                  <img src={p.images?.[0]} alt="" className="w-14 h-14 object-cover rounded" />
                </td>
                <td className="font-medium">{p.title}</td>
                <td>{p.category}</td>
                <td>
                  ৳ {p.price}
                  {p.oldPrice ? <span className="text-gray-400 line-through ml-2">৳ {p.oldPrice}</span> : null}
                </td>
                <td>{p.weight}</td>
                <td className="pr-3">
                  <div className="flex gap-3">
                    <Link to={`/admin/products/${p.id}`} className="text-green-700 hover:underline">বিস্তারিত</Link>
                    <button onClick={() => remove(p.id, p.title)} className="text-red-600 hover:underline">মুছুন</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={onSubmit} className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">নতুন পণ্য</h2>

            <Field label="পণ্যের নাম" name="title" value={form.title} onChange={onChange} required />
            <Field label="ক্যাটাগরি" name="category" value={form.category} onChange={onChange} placeholder="grocery / snacks" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="দাম" name="price" type="number" value={form.price} onChange={onChange} required />
              <Field label="পুরনো দাম" name="oldPrice" type="number" value={form.oldPrice} onChange={onChange} />
            </div>
            <Field label="ওজন" name="weight" value={form.weight} onChange={onChange} placeholder="৫০০ গ্রাম" />
            <label className="text-sm text-gray-600">বিবরণ</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 mb-3"
              rows={3}
            />
            <label className="text-sm text-gray-600">ছবি আপলোড</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => setFiles([...e.target.files])}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 mb-3"
            />
            <label className="text-sm text-gray-600">অথবা ছবির লিঙ্ক (প্রতি লাইনে একটি)</label>
            <textarea
              name="imagesText"
              value={form.imagesText}
              onChange={onChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 mb-4"
              rows={3}
              placeholder="https://..."
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
            >
              {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", required, placeholder }) {
  return (
    <>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-3 py-2 mt-1 mb-3"
      />
    </>
  );
}
