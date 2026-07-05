import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axios";
import logo from "../../public/logo.png";
import { useTheme } from "../../context/ThemeContext";


const ADMIN_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/orders', label: 'Orders' }, 
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/inventory', label: 'Inventory' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/cashiers', label: 'Cashiers' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/settings', label: 'Settings' },
];

const CASHIER_LINKS = [
  { to: '/cashier/pos', label: 'Quick Sale' },
  { to: '/cashier/shifts', label: 'Shift History' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'admin' ? ADMIN_LINKS : CASHIER_LINKS;
  const [newOrderCount, setNewOrderCount] = useState(0);
  const { theme, toggleTheme } = useTheme();

  async function loadNewOrderCount() {
    if (user?.role !== "admin") return;

    try {
      const { data } = await api.get("/admin/orders", {
        params: {
          status: "pending",
        },
      });

      setNewOrderCount(data.length);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (user?.role !== "admin") return;

    loadNewOrderCount();

    const interval = setInterval(loadNewOrderCount, 5000);

    return () => clearInterval(interval);
  }, [user]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800 dark:bg-ngip-bg dark:text-ngip-text transition-colors duration-200">

      {/* SIDEBAR */}
      <aside className="w-56 bg-white/90 dark:bg-ngip-panel backdrop-blur border-r border-gray-200 dark:border-white/5 flex flex-col transition-colors">

        {/* LOGO SECTION */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-gray-200 dark:border-white/5">
          <img
            src={logo}
            alt="Ngip Store"
            className="w-11 h-11 rounded-xl object-cover bg-white shadow-sm"
          />

          <div>
            <h1 className="font-display font-bold text-base text-gray-900 dark:text-white">
              Ngiple Store
            </h1>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-ngip-accent text-ngip-bg font-semibold shadow-sm"
                    : "text-gray-600 dark:text-ngip-muted hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              <span>{l.label}</span>

              {l.label === "Orders" && newOrderCount > 0 && (
                <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {newOrderCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="px-3 py-4 border-t border-gray-200 dark:border-white/5">

          <div className="text-xs text-gray-500 dark:text-ngip-muted px-3 mb-3 truncate">
            {user?.name} · {user?.role}
          </div>

          {/* THEME BUTTON */}
          <button
            onClick={toggleTheme}
            className="w-full mb-2 text-left px-3 py-2 rounded-lg text-sm
            bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-ngip-muted
            hover:bg-gray-200 dark:hover:bg-white/10 transition"
          >
            {theme === "dark" ? "🌙 Dark Mode" : "☀ Light Mode"}
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-ngip-bg transition-colors duration-200">
        {children}
      </main>

    </div>
  );
}
