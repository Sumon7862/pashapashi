import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logo from '../assets/favicon.png';

export default function Navbar() {
  const count = useSelector(s =>
    s.cart.items.reduce((a, b) => a + b.qty, 0)
  );

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link to="/" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0">
            <img src={logo} alt="logo" className="w-full h-full object-contain" />
          </Link>
          <Link to="/" className="text-lg sm:text-xl font-semibold truncate">
            পাশাপাশি
          </Link>
        </div>

        <Link to="/cart" className="relative p-2 shrink-0">
          <ShoppingCartIcon className="w-6 h-6" />
          {count > 0 && (
            <span className="absolute top-0 right-0 bg-green-600 text-white text-xs px-1.5 rounded-full">
              {count}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
