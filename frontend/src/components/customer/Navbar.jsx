import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import {
  FiHome,
  FiShoppingCart,
  FiPackage,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className=" sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-ngip-bg/80 border-b border-gray-200 dark:border-white/5 shadow-sm ">
      <div className="max-w-screen-xl mx-auto px-5 py-4 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <div className=" w-10 h-10 rounded-xl bg-ngip-accent text-ngip-bg font-bold text-lg flex items-center justify-center shadow-md ">
            {" "}
            🏪{" "}
          </div>
          <div>
            <div className="font-display font-bold text-lg">Ngip</div>

            <div className="text-xs text-gray-500 dark:text-ngip-muted">
              Sari-Sari Store
            </div>
          </div>
        </NavLink>

        <nav className="flex items-center gap-2 lg:gap-4 px-6 text-sm">
          <NavLink
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 dark:text-ngip-muted hover:text-ngip-accent hover:bg-gray-100 dark:hover:bg-white/5 transition"
          >
            {" "}
            <FiHome size={18} /> Shop
          </NavLink>

          <NavLink
              to="/orders"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 dark:text-ngip-muted hover:text-ngip-accent hover:bg-gray-100 dark:hover:bg-white/5 transition"
            >
              <FiPackage size={18} />
              My Orders
            </NavLink>

          <NavLink
            to="/cart"
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 dark:text-ngip-muted hover:text-ngip-accent hover:bg-gray-100 dark:hover:bg-white/5 transition"
          >
            <FiShoppingCart size={18} />
            Cart
            {count > 0 && (
              <span className="
                    absolute
                    -top-2
                    -right-2
                    min-w-[18px]
                    h-[18px]
                    rounded-full
                    bg-red-500
                    text-white
                    text-[10px]
                    font-bold
                    flex items-center justify-center
                    shadow-lg
                    ">
                {count}
              </span>
            )}
          </NavLink>

          {user ? (
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200 dark:border-white/10">
              <Link to="/profile">
                  <div className="w-10 h-10 rounded-full bg-ngip-accent text-ngip-bg font-bold flex items-center justify-center hover:scale-105 transition">
                      {user.name?.charAt(0).toUpperCase()}
                  </div>
              </Link>

              <div className="hidden md:block">
                  <div className="font-semibold">
                      Hi, {user.name.split(" ")[0]}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-ngip-muted">
                      Customer Account
                  </div>
              </div>

              <button
                onClick={handleLogout}
                className="
                  flex items-center gap-2
                  px-4 py-2
                  rounded-xl
                  border border-red-500/20
                  text-red-500
                  hover:bg-red-500
                  hover:text-white
                  transition
                  "
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="bg-ngip-accent text-ngip-bg font-semibold px-5 py-2.5 rounded-xl shadow hover:scale-105 transition"
            >
              Sign in
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
