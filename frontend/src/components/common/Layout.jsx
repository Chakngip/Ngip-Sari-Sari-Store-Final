import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import logo from "../../public/logo.png";

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

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-ngip-panel border-r border-white/5 flex flex-col">
        <div className="px-5 py-5 flex items-center gap-3 border-b border-white/5">
          <img
            src={logo}
            alt="Ngip Store"
            className="w-11 h-11 rounded-xl object-cover bg-white p-1"
          />

          <div>
            <h1 className="font-display font-bold text-base">
              Ngip Store
            </h1>

          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm transition ${
                  isActive ? 'bg-ngip-accent text-ngip-bg font-semibold' : 'text-ngip-muted hover:bg-white/5 hover:text-ngip-text'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/5">
          <div className="text-xs text-ngip-muted px-3 mb-2 truncate">{user?.name} · {user?.role}</div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-ngip-accent2 hover:bg-ngip-accent2/10 transition"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
