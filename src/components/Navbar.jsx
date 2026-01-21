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
      <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <Link>
            <div className="w-10 h-10 mt-2">
              <img src={logo} alt="logo" />
            </div>
            </Link>
        <Link to="/" className="text-xl font-semibold">
          পাশাপাশি
        </Link>
        </div>

        <Link to="/cart" className="relative">
          <ShoppingCartIcon className="w-6 h-6" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-1.5 rounded-full">
              {count}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
