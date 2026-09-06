import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { useEffect, useState } from "react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: products, status } = useSelector(s => s.products);

  const product = products.find(p => String(p.id) === String(id));
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState("");

  useEffect(() => {
    if (product?.images?.[0]) setImg(product.images[0]);
  }, [product]);

  if (status === "idle" || status === "loading") {
    return (
      <div className="max-w-6xl mx-auto mt-28 px-4 text-center text-gray-500">
        লোড হচ্ছে...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto mt-28 px-4 text-center text-gray-500">
        <p>পণ্য পাওয়া যায়নি</p>
        <button onClick={() => navigate("/")} className="mt-4 text-green-700">
          ← হোমে ফিরুন
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-24 px-4 grid md:grid-cols-2 gap-8">
      <div>
        <img src={img} alt={product.title} className="w-full rounded-xl" />
        <div className="flex gap-3 mt-3">
          {(product.images || []).map(i => (
            <img
              key={i}
              src={i}
              alt=""
              onClick={() => setImg(i)}
              className="w-16 h-16 border cursor-pointer object-cover"
            />
          ))}
        </div>
      </div>

      <div>
        <button onClick={() => navigate(-1)}>← পেছনে</button>
        <h1 className="text-2xl font-bold mt-3">{product.title}</h1>
        <p>{product.description}</p>

        <div className="flex gap-4 mt-4 items-center">
          <button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
          <span>{qty}</span>
          <button onClick={() => setQty(q => q + 1)}>+</button>
        </div>

        <button
          onClick={() => dispatch(addToCart({ product, qty }))}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
        >
          যোগ করুন
        </button>
      </div>
    </div>
  );
}
