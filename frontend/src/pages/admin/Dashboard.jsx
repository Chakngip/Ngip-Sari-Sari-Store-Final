import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/common/Layout.jsx";
import StatCard from "../../components/admin/StatCard.jsx";
import {
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiBox,
  FiUserCheck,
  FiMonitor,
  FiClock,
} from "react-icons/fi";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/dashboard/stats")
      .then(({ data }) => setStats(data))
      .catch(() => setError("Could not load dashboard stats"));
  }, []);

  const peso = (n) =>
    `₱${Number(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>

            <p className="text-gray-500 dark:text-ngip-muted mt-1">
              Welcome back, Admin 👋
            </p>

            <p className="text-sm text-gray-400 dark:text-ngip-muted">
              Here's what's happening in your store today.
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-ngip-muted">
              {new Date().toLocaleDateString("en-PH", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <p className="text-xs text-gray-400 dark:text-ngip-muted">
              Store Overview
            </p>
          </div>
        </div>

        {error && <div className="text-ngip-accent2 text-sm mb-4">{error}</div>}

        {stats && (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              <StatCard
                icon={<FiDollarSign size={22} />}
                label="Sales Today"
                value={peso(stats.salesToday)}
                subtitle="Today's revenue"
                accent
              />

              <StatCard
                icon={<FiShoppingCart size={22} />}
                label="Orders Today"
                value={stats.ordersToday}
              />

              <StatCard
                icon={<FiBox size={22} />}
                label="Active Products"
                value={stats.totalProducts}
              />

              <StatCard
                icon={<FiUsers size={22} />}
                label="Customers"
                value={stats.totalCustomers}
              />

              <StatCard
                icon={<FiUserCheck size={22} />}
                label="Cashiers"
                value={stats.totalCashiers}
              />

              <StatCard
                icon={<FiMonitor size={22} />}
                label="Online Sales"
                value={peso(stats.lifetimeOnlineSales)}
              />

              <StatCard
                icon={<FiDollarSign size={22} />}
                label="POS Sales"
                value={peso(stats.lifetimePosSales)}
              />

              <StatCard
                icon={<FiClock size={22} />}
                label="Pending Orders"
                value={stats.pendingOrders}
                subtitle="Waiting for processing"
              />
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
              {/* Recent Orders */}
              <div className="bg-white dark:bg-ngip-panel rounded-2xl border border-gray-200 dark:border-white/5 p-5">
                <h2 className="font-display font-bold text-lg mb-4">
                  Recent Orders
                </h2>

                <div className="h-[420px] overflow-y-auto">
                  {stats.recentOrders?.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-white/5 last:border-0"
                      >
                        <div>
                          <div className="font-semibold">
                            {order.receipt_number}
                          </div>

                          <div className="text-xs text-gray-500 dark:text-ngip-muted">
                            {order.customer?.name ||
                              order.cashier?.name ||
                              "Walk-in"}
                          </div>
                        </div>

                        <span className="capitalize text-sm">
                          {order.status.replaceAll("_", " ")}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 dark:text-ngip-muted py-10">
                      No recent orders.
                    </div>
                  )}
                </div>
              </div>

              {/* Low Stock Products */}
              <div className="bg-white dark:bg-ngip-panel rounded-2xl border border-gray-200 dark:border-white/5 p-5">
                <h2 className="font-display font-bold text-lg mb-4">
                  Low Stock Products
                </h2>

                <div className="h-[420px] overflow-y-auto">
                  {stats.lowStockProducts?.length > 0 ? (
                    stats.lowStockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-white/5 last:border-0"
                      >
                        <div>
                          <div className="font-semibold">{product.name}</div>

                          <div className="text-xs text-gray-500 dark:text-ngip-muted">
                            {product.category}
                          </div>
                        </div>

                        <span className="font-bold text-red-500">
                          {product.stock_qty} left
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 dark:text-ngip-muted py-10">
                      No low stock products.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
