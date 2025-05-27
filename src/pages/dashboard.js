import { useState, useEffect } from "react";
import { BarChart3, PackageCheck, ShoppingCart } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getUser } from "../app/utils/auth";
import { useRouter } from "next/router";
import { fetchProducts } from "../app/utils/products";
import { useUserStore } from "../app/stores/user";

// Sample data for charts and tables
const stockData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 900 },
  { name: "Jul", value: 1100 },
];

export default function Dashboard() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [noStockCount, setNoStockCount] = useState(0);

  const [hasMounted, setHasMounted] = useState(false);



  const loadProducts = async () => {
    if (!user) return;

    const { data, error } = await fetchProducts(user.email);

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
  };

  useEffect(() => {
    loadProducts();
    setHasMounted(true);
  }, [user]);

  useEffect(() => {
    if (!hasMounted) return;

    const total = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    setTotalPrice(total);

    const low = products.filter(
      (p) => p.quantity > 0 && p.quantity <= 5
    ).length;
    const none = products.filter((p) => p.quantity === 0).length;

    setLowStockCount(low);
    setNoStockCount(none);
  }, [products, hasMounted]);

  return (
    <div className="flex h-full bg-gray-900 text-gray-100 ">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          {/* Welcome & Date */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user?.name || "User"}!
              </h1>
              <p className="text-gray-400">
                Here's what's happening with your stock today.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-gray-800 rounded-md px-4 py-2 text-sm font-medium text-gray-300">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-300">
                  Total Products
                </h2>
                <div className="bg-indigo-600/20 text-indigo-400 p-2 rounded-md">
                  <PackageCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">
                    {products?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-300">
                  Stock Value
                </h2>
                <div className="bg-green-600/20 text-green-400 p-2 rounded-md">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  {hasMounted && (
                    <span className="text-3xl font-bold text-white">
                      {new Intl.NumberFormat("en-ZA", {
                        style: "currency",
                        currency: "ZAR",
                      }).format(totalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-300">
                  Low Stock Items
                </h2>
                <div className="bg-yellow-600/20 text-yellow-400 p-2 rounded-md">
                  <ShoppingCart className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">
                    {lowStockCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-300">
                  Out of Stock
                </h2>
                <div className="bg-red-600/20 text-red-400 p-2 rounded-md">
                  <PackageCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">
                    {noStockCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts & Activities */}
          <div className="grid grid-cols-1  gap-6 mb-8">
            {/* Stock Trend Chart */}
            <div className=" bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-white">Sales</h2>
                <div className="flex items-center space-x-2">
                  <select className="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                        color: "#F9FAFB",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#6366F1"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#6366F1" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Inventory Table */}
        </main>
      </div>
    </div>
  );
}
