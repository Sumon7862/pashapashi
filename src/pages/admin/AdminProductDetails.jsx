import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteProduct } from "../../redux/productsSlice";

export default function AdminProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = useSelector(s => s.products.items.find(p => String(p.id) === String(id)));

  if (!product) {
    return (
      <div>
        <p className="text-gray-500">পণ্য পাওয়া যায়নি</p>
        <Link to="/admin/products" className="text-green-700 mt-3 inline-block">← পণ্য তালিকায় ফিরুন</Link>
      </div>
    );
  }

  const remove = async () => {
    if (!window.confirm(`"${product.title}" মুছে ফেলতে চান?`)) return;
    try {
      await dispatch(deleteProduct(product.id)).unwrap();
      navigate("/admin/products");
    } catch (err) {
      alert(err.message || "পণ্য মুছা যায়নি");
    }
  };

  const rows = [
    ["আইডি", product.id],
    ["নাম", product.title],
    ["ক্যাটাগরি", product.category],
    ["দাম", `৳ ${product.price}`],
    ["পুরনো দাম", product.oldPrice ? `৳ ${product.oldPrice}` : "—"],
    ["ওজন", product.weight || "—"],
    ["বিবরণ", product.description || "—"],
  ];

  return (
    <div>
      <Link to="/admin/products" className="text-gray-600 hover:text-gray-900">← পণ্য তালিকা</Link>
      <div className="flex flex-wrap items-start justify-between gap-3 mt-3 mb-6">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <div className="flex gap-2">
          <Link
            to={`/admin/products?edit=${product.id}`}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            সম্পাদনা
          </Link>
          <button onClick={remove} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            পণ্য মুছুন
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <img
            src={product.images?.[0]}
            alt={product.title}
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="flex gap-3 mt-3 flex-wrap">
            {(product.images || []).map(src => (
              <img key={src} src={src} alt="" className="w-20 h-20 object-cover rounded border" />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold mb-4">সব তথ্য</h2>
          <dl className="space-y-3 text-sm">
            {rows.map(([label, value]) => (
              <div key={label} className="grid grid-cols-3 gap-3 border-b pb-2 last:border-0">
                <dt className="text-gray-500">{label}</dt>
                <dd className="col-span-2">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
