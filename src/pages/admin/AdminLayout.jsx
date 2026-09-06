import { useEffect } from "react";
import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { fetchOrders } from "../../redux/ordersSlice";
import { fetchProducts } from "../../redux/productsSlice";
import logo from "../../assets/favicon.png";

const linkClass = ({ isActive }) =>
  `block px-4 py-2 rounded-lg ${isActive ? "bg-green-600 text-white" : "text-gray-200 hover:bg-gray-700"}`;

export default function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAdmin, loading, logout } = useAdminAuth();

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchProducts());
      dispatch(fetchOrders());
    }
  }, [dispatch, isAdmin]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">লোড হচ্ছে...</div>;
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const onLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <aside className="w-full md:w-56 bg-gray-800 text-white flex flex-col p-4 shrink-0">
        <div className="flex items-center gap-2 mb-8 px-2">
          <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
          <span className="font-semibold">অ্যাডমিন</span>
        </div>

        <nav className="flex flex-col gap-1">
          <NavLink to="/admin" end className={linkClass}>ড্যাশবোর্ড</NavLink>
          <NavLink to="/admin/products" className={linkClass}>পণ্যসমূহ</NavLink>
          <NavLink to="/admin/orders" className={linkClass}>অর্ডারসমূহ</NavLink>
          <NavLink to="/admin/settings" className={linkClass}>সেটিংস</NavLink>
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          <NavLink to="/" className="px-4 py-2 text-gray-300 hover:text-white text-sm">
            ← দোকানে যান
          </NavLink>
          <button onClick={onLogout} className="px-4 py-2 text-left text-red-300 hover:text-red-200 text-sm">
            লগআউট
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
