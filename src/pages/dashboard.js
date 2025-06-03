import { useState, useEffect } from "react";
import { BarChart3, PackageCheck, ShoppingCart, TrendingUp, Boxes } from "lucide-react"; // Added Boxes icon for products
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/router";
import { useUserStore } from "../app/stores/user";
import { fetchProducts } from "../app/utils/products"; // Keep this import
import { fetchOrders } from "../app/utils/orders"; // Import your fetchOrders utility
import toast from "react-hot-toast";

export default function Dashboard() {
  const user = useUserStore((state) => state.user);

  // Product-related states
  const [products, setProducts] = useState([]);
  const [totalStockValue, setTotalStockValue] = useState(0); // Renamed from totalPrice for clarity
  const [lowStockCount, setLowStockCount] = useState(0);
  const [noStockCount, setNoStockCount] = useState(0);

  // Sales-related states
  const [orders, setOrders] = useState([]);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [salesToday, setSalesToday] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0); // New state for total number of orders
  const [dailyOrdersCount, setDailyOrdersCount] = useState(0); // New state for number of orders today
  const [salesTrendData, setSalesTrendData] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Function to fetch products
  const loadProducts = async () => {
    setLoadingProducts(true);
    if (!user?.email) {
      console.warn("User email not available for loading products.");
      setLoadingProducts(false);
      return;
    }

    const { data, error } = await fetchProducts(user.email);

    if (error) {
      toast.error("Failed to load product data.");
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
    setLoadingProducts(false);
  };

  // Function to fetch orders
  const loadOrders = async () => {
    setLoadingOrders(true);
    if (!user?.email) {
      console.warn("User email not available for loading orders.");
      setLoadingOrders(false);
      return;
    }

    const { data, error } = await fetchOrders(user.email);

    if (error) {
      toast.error("Failed to load sales data.");
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data);
    }
    setLoadingOrders(false);
  };

  // Load data on user change
  useEffect(() => {
    loadProducts();
    loadOrders();
  }, [user]);

  // Effect for product calculations
  useEffect(() => {
    const total = products.reduce(
      (sum, product) => sum + (product.price || 0) * (product.quantity || 0),
      0
    );
    setTotalStockValue(total);

    const low = products.filter(
      (p) => (p.quantity > 0 && p.quantity <= 5)
    ).length;
    const none = products.filter((p) => p.quantity === 0).length;

    setLowStockCount(low);
    setNoStockCount(none);
  }, [products]);

  // Effect for sales calculations
  useEffect(() => {
    if (orders.length === 0 && !loadingOrders) {
      setTotalSalesAmount(0);
      setSalesToday(0);
      setTotalOrdersCount(0);
      setDailyOrdersCount(0);
      setSalesTrendData([]);
      return;
    }

    // Calculate Total Sales Amount
    const totalSales = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );
    setTotalSalesAmount(totalSales);

    // Calculate Sales Today & Daily Orders Count
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of today

    let currentDaySales = 0;
    let currentDayOrders = 0;

    const salesByDate = {};
    // Initialize sales for the last 7 days to 0
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      salesByDate[d.toLocaleDateString('en-US')] = 0;
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      orderDate.setHours(0, 0, 0, 0); // Normalize order date

      if (orderDate.getTime() === today.getTime()) {
        currentDaySales += (order.totalAmount || 0);
        currentDayOrders += 1;
      }

      // Populate data for trend chart if within the last 7 days
      if (salesByDate.hasOwnProperty(orderDate.toLocaleDateString('en-US'))) {
        salesByDate[orderDate.toLocaleDateString('en-US')] += (order.totalAmount || 0);
      }
    });

    setSalesToday(currentDaySales);
    setDailyOrdersCount(currentDayOrders);
    setTotalOrdersCount(orders.length); // Total count of all orders

    const trendData = Object.keys(salesByDate).map(dateString => ({
      name: new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: salesByDate[dateString],
    })).sort((a, b) => new Date(a.name) - new Date(b.name)); // Sort by date

    setSalesTrendData(trendData);

  }, [orders, loadingOrders]);

  const loading = loadingProducts || loadingOrders; // Combined loading state for overall dashboard

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
                Here's a quick overview of your sales and inventory today.
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

          {/* Stat Cards - Sales Section */}
          <h2 className="text-xl font-bold text-white mb-4">Sales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-300">
                  Total Sales Amount
                </h2>
                <div className="bg-indigo-600/20 text-indigo-400 p-2 rounded-md">
                  <ShoppingCart className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">
                    {loadingOrders ? (
                      <div className="animate-pulse bg-gray-700 h-8 w-24 rounded"></div>
                    ) : (
                      new Intl.NumberFormat("en-ZA", {
                        style: "currency",
                        currency: "ZAR",
                      }).format(totalSalesAmount)
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-300">
                  Sales Today
                </h2>
                <div className="bg-green-600/20 text-green-400 p-2 rounded-md">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">
                    {loadingOrders ? (
                      <div className="animate-pulse bg-gray-700 h-8 w-24 rounded"></div>
                    ) : (
                      new Intl.NumberFormat("en-ZA", {
                        style: "currency",
                        currency: "ZAR",
                      }).format(salesToday)
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-300">
                  Total Orders
                </h2>
                <div className="bg-yellow-600/20 text-yellow-400 p-2 rounded-md">
                  <PackageCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">
                    {loadingOrders ? (
                      <div className="animate-pulse bg-gray-700 h-8 w-12 rounded"></div>
                    ) : (
                      totalOrdersCount
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-300">
                  Orders Today
                </h2>
                <div className="bg-red-600/20 text-red-400 p-2 rounded-md">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">
                    {loadingOrders ? (
                      <div className="animate-pulse bg-gray-700 h-8 w-12 rounded"></div>
                    ) : (
                      dailyOrdersCount
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>


          {/* Stat Cards - Inventory Section */}
          <h2 className="text-xl font-bold text-white mb-4">Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-300">
                  Total Products
                </h2>
                <div className="bg-blue-600/20 text-blue-400 p-2 rounded-md">
                  <Boxes className="h-5 w-5" /> {/* Using Boxes icon for products */}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">
                    {loadingProducts ? (
                      <div className="animate-pulse bg-gray-700 h-8 w-12 rounded"></div>
                    ) : (
                      products?.length || 0
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-300">
                  Total Stock Value
                </h2>
                <div className="bg-purple-600/20 text-purple-400 p-2 rounded-md">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">
                    {loadingProducts ? (
                      <div className="animate-pulse bg-gray-700 h-8 w-24 rounded"></div>
                    ) : (
                      new Intl.NumberFormat("en-ZA", {
                        style: "currency",
                        currency: "ZAR",
                      }).format(totalStockValue)
                    )}
                  </span>
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
                    {loadingProducts ? (
                      <div className="animate-pulse bg-gray-700 h-8 w-12 rounded"></div>
                    ) : (
                      lowStockCount
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-300">
                  Out of Stock
                </h2>
                <div className="bg-orange-600/20 text-orange-400 p-2 rounded-md">
                  <PackageCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">
                    {loadingProducts ? (
                      <div className="animate-pulse bg-gray-700 h-8 w-12 rounded"></div>
                    ) : (
                      noStockCount
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

      
          {/* Sales Trend Chart */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-white">Sales Trend (Last 7 Days)</h2>
              </div>
              <div className="h-64">
                {loadingOrders ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
                  </div>
                ) : salesTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        formatter={(value) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value)}
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
                ) : (
                  <p className="text-center text-gray-400">No sales data available for the trend.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}