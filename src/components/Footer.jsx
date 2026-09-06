import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from '../assets/favicon.png';
import useSiteStats from "../hooks/useSiteStats";

export default function Footer() {
  const { orders, visitors, online } = useSiteStats();

  return (
    <footer className="bg-gray-800 text-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10 grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
        
        {/* Brand + Tagline */}
        <div className="flex flex-col gap-2">
          <Link to="/" className="flex gap-3">
            <div className="w-12 h-12 -mt-3">
              <img src={logo} alt="logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-semibold text-white">পাশাপাশি</span>
          </Link>
          <p className="text-gray-400 text-sm">
             আপনার পাশের দোকান
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-2 text-white">যোগাযোগ</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>📞 ০১৯৩৭৯৫২৫২৭</li>
            <li className="flex items-center gap-2">
              💬 <a href="https://wa.me/01937952527" target="_blank" rel="noopener noreferrer" className="hover:text-white">হোয়াটসঅ্যাপ</a>
            </li>
            <li className="flex items-center gap-2">
              📘 <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer" className="hover:text-white">ফেসবুক পেজ</a>
            </li>
            <li>
              <Link to="/admin" className="hover:text-white">অ্যাডমিন প্যানেল</Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-2 text-white">আমাদের অনুসরণ করুন</h3>
          <div className="flex gap-3 mt-2">
            <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer" className="bg-gray-700 p-2 rounded-full hover:bg-blue-600 transition">
              <FaFacebookF />
            </a>
            <a href="https://wa.me/01937952527" target="_blank" rel="noopener noreferrer" className="bg-gray-700 p-2 rounded-full hover:bg-green-500 transition">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6">
        <div className="max-w-6xl mx-auto px-4 py-5 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-white text-xl font-semibold">{orders}</p>
            <p className="text-gray-400 text-xs sm:text-sm">মোট অর্ডার</p>
          </div>
          <div>
            <p className="text-white text-xl font-semibold">{online}</p>
            <p className="text-gray-400 text-xs sm:text-sm">এখন অনলাইন</p>
          </div>
          <div>
            <p className="text-white text-xl font-semibold">{visitors}</p>
            <p className="text-gray-400 text-xs sm:text-sm">মোট ভিজিটর</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 p-4 text-center text-gray-500 text-sm">
        © ২০২৬ পাশাপাশি. সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}
