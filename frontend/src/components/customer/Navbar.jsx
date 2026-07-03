import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="border-b border-white/5 bg-ngip-panel/60 backdrop-blur sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-ngip-accent text-ngip-bg font-display font-bold flex items-center justify-center">N</div>
          <span className="font-display font-bold text-sm">Ngip Sari-Sari Store</span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link to="/" className="text-ngip-muted hover:text-ngip-text transition">Shop</Link>
          {user && <Link to="/orders" className="text-ngip-muted hover:text-ngip-text transition">My Orders</Link>}
          <Link to="/cart" className="relative text-ngip-muted hover:text-ngip-text transition">
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-ngip-accent text-ngip-bg text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <button onClick={handleLogout} className="text-ngip-accent2 hover:underline">Log out</button>
          ) : (
            <Link to="/login" className="bg-ngip-accent text-ngip-bg font-semibold px-3 py-1.5 rounded-lg hover:opacity-90">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
