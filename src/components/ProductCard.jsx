import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const nav = useNavigate();

  return (
    <div
      onClick={() => nav(`/product/${product.id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer overflow-hidden"
    >
      {/* IMAGE WRAPPER */}
      <div className="relative overflow-hidden group">
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-40 w-full object-cover transform transition duration-300 group-hover:scale-105"
        />

        {/* ADD TO CART BUTTON */}
        <button
          onClick={e => {
            e.stopPropagation(); // avoid navigating to details page
            dispatch(addToCart({ product, qty: 1 }));
          }}
          className="
            absolute left-0 right-0 bottom-0
            bg-green-600 text-white py-2
            opacity-0 translate-y-4
            group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-300
          "
        >
          যোগ করুন
        </button>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="p-3">
        <h3 className="font-medium text-gray-800">{product.title}</h3>
        <p className="text-xs text-gray-500">{product.weight}</p>
        <div className="flex gap-2 mt-1 items-center">
          <span className="font-semibold text-gray-900">৳ {product.price}</span>
          <span className="line-through text-gray-400 text-sm">
            ৳ {product.oldPrice}
          </span>
        </div>
      </div>
    </div>
  );
}
