import { Link, useNavigate } from "react-router-dom";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";
import Navbar from '../../components/customer/Navbar.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleCheckout() {
    if (!user) {
      navigate('/login?next=/checkout');
      return;
    }
    navigate('/checkout');
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="mb-8">

          <h1 className="font-display text-3xl font-bold">
            Shopping Cart
          </h1>

          <p className="text-gray-500 dark:text-ngip-muted mt-2">
            {items.length} item{items.length !== 1 && "s"} in your cart
          </p>

        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">

            <div className="text-7xl mb-6">
                🛒
            </div>

            <h2 className="font-display text-2xl font-bold mb-2">
                Your cart is empty
            </h2>

            <p className="text-gray-500 dark:text-ngip-muted mb-8">
                Looks like you haven't added anything yet.
            </p>

            <Link
                to="/"
                className="
                inline-flex
                items-center
                gap-2
                bg-ngip-accent
                text-ngip-bg
                px-6
                py-3
                rounded-xl
                font-semibold
                "
            >
                Continue Shopping
                <FiArrowRight />
            </Link>

        </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-3 gap-8">

              {/* LEFT SIDE - CART ITEMS */}

              <div className="lg:col-span-2">

                <div className="bg-white dark:bg-ngip-panel border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 dark:border-white/5">

                    <h2 className="font-display text-xl font-bold">
                      Cart Items
                    </h2>

                  </div>

                  <div
                    className="
                      max-h-[650px]
                      overflow-y-auto
                    "
                  >
                    {items.map((i) => (
                      <div
                        key={i.product.id}
                        className="
                          flex
                          gap-5
                          p-5
                          border-b
                          border-gray-200
                          dark:border-white/5
                          last:border-0
                        "
                      >

                        {/* Image */}

                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 dark:bg-black/20 flex-shrink-0">

                          {i.product.image_url ? (
                            <img
                              src={i.product.image_url}
                              alt={i.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-4xl">
                              📦
                            </div>
                          )}

                        </div>

                        {/* Product Info */}

                        <div className="flex-1">

                          <h3 className="font-semibold text-lg">
                            {i.product.name}
                          </h3>

                          <p className="text-sm text-gray-500 dark:text-ngip-muted mt-1">
                            ₱{Number(i.product.price).toFixed(2)} each
                          </p>

                          <div className="mt-4 flex items-center justify-between">

                            <div className="flex items-center rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">

                              <button
                                onClick={() => updateQty(i.product.id, i.quantity - 1)}
                                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
                              >
                                <FiMinus />
                              </button>

                              <span className="px-5 font-semibold">
                                {i.quantity}
                              </span>

                              <button
                                onClick={() => updateQty(i.product.id, i.quantity + 1)}
                                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
                              >
                                <FiPlus />
                              </button>

                            </div>

                            <div className="text-right">

                              <div className="font-display text-xl font-bold text-ngip-accent">
                                ₱{(Number(i.product.price) * i.quantity).toFixed(2)}
                              </div>

                              <button
                                onClick={() => removeItem(i.product.id)}
                                className="mt-2 text-red-500 text-sm flex items-center gap-1 hover:underline"
                              >
                                <FiTrash2 />
                                Remove
                              </button>

                            </div>

                          </div>

                        </div>

                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT SIDE - ORDER SUMMARY */}

              <div>

                  <div
                    className="
                      bg-white
                      dark:bg-ngip-panel
                      border
                      border-gray-200
                      dark:border-white/5
                      rounded-3xl
                      p-6
                      shadow-sm
                    "
                  >

                    <h2 className="font-display text-xl font-bold mb-5">
                      Order Summary
                    </h2>

                    <div className="flex justify-between mb-3">

                      <span className="text-gray-500 dark:text-ngip-muted">
                        Items
                      </span>

                      <span>{items.length}</span>

                    </div>

                    <div className="flex justify-between mb-3">

                      <span className="text-gray-500 dark:text-ngip-muted">
                        Shipping
                      </span>

                      <span className="text-green-500 font-medium">
                        FREE
                      </span>

                    </div>

                    <hr className="my-5 border-gray-200 dark:border-white/10" />

                    <div className="flex justify-between items-center mb-6">

                      <span className="font-semibold">
                        Total
                      </span>

                      <span className="font-display text-3xl font-bold text-ngip-accent">
                        ₱{total.toFixed(2)}
                      </span>

                    </div>

                    <button
                      onClick={handleCheckout}
                      className="
                        w-full
                        bg-ngip-accent
                        text-ngip-bg
                        py-4
                        rounded-2xl
                        font-bold
                        text-lg
                        flex
                        items-center
                        justify-center
                        gap-2
                        hover:scale-[1.02]
                        transition
                      "
                    >
                      Checkout

                      <FiArrowRight />

                    </button>

                  </div>

                </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
