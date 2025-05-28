import React, { useEffect, useState } from "react";
import { fetchOrders } from "../app/utils/orders"; // Import your fetchOrders utility
import { useUserStore } from "../app/stores/user";
import toast from "react-hot-toast";
import { CalendarDays, Receipt, X, ListOrdered } from "lucide-react";

const SalesPage = () => {
  const user = useUserStore((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);

  // State for date filtering
  const [filterDate, setFilterDate] = useState(""); // For specific date selection
  const [filterRange, setFilterRange] = useState("allTime"); // For date range selection

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    if (!user?.email) {
      setError("User email not available. Cannot load orders.");
      setLoading(false);
      return;
    }
    console.log(user, "Loading orders for user email:", user.email);

    const { data, error } = await fetchOrders(user.email);
    if (error) {
      toast.error("Failed to load sales data.");
      console.error("Fetch orders error:", error);
      setError("Failed to load orders.");
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [user]); // Reload orders when user changes (e.g., on login)

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailsModalOpen(true);
  };

  // Helper function to check if a date is today
  const isToday = (someDate) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  // Filtering logic for orders based on selected date or range
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.orderDate);
    orderDate.setHours(0, 0, 0, 0); // Normalize to start of the day for accurate comparison

    if (filterDate) {
      const selected = new Date(filterDate);
      selected.setHours(0, 0, 0, 0); // Normalize to start of the day
      return orderDate.getTime() === selected.getTime();
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filterRange) {
      case "today":
        return isToday(orderDate);
      case "last7Days":
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return orderDate >= sevenDaysAgo && orderDate <= today;
      case "last30Days":
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return orderDate >= thirtyDaysAgo && orderDate <= today;
      case "allTime":
      default:
        return true;
    }
  });

  // Calculate total sales and total orders for filtered data
  const totalSales = filteredOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );
  const totalOrders = filteredOrders.length;

  // Calculate today's orders specifically for the "Today's Orders" card
  const todayOrders = orders.filter((order) => isToday(new Date(order.orderDate))).length;

  return (
    <div className="h-full bg-gray-900 text-white ">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold">Sales Overview</h1>
          </div>
          {/* Date Filtering Controls */}
          <div className="flex space-x-4">
            <select
              value={filterRange}
              onChange={(e) => {
                setFilterRange(e.target.value);
                setFilterDate(""); // Clear specific date when a range is chosen
              }}
              className="bg-gray-700 text-white rounded-lg p-2"
            >
              <option value="today">Today</option>
              <option value="last7Days">Last 7 Days</option>
              <option value="last30Days">Last 30 Days</option>
              <option value="allTime">All Time</option>
            </select>
          </div>
        </div>

        {/* Sales Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg flex items-center space-x-4">
            <div>
              <p className="text-gray-400 text-sm">Total Sales</p>
              <h2 className="text-2xl font-bold">R{totalSales.toFixed(2)}</h2>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg flex items-center space-x-4">
            <ListOrdered className="w-10 h-10 text-blue-400" />
            <div>
              <p className="text-gray-400 text-sm">Total Orders </p>
              <h2 className="text-2xl font-bold">{totalOrders}</h2>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg flex items-center space-x-4">
            <CalendarDays className="w-10 h-10 text-purple-400" />
            <div>
              <p className="text-gray-400 text-sm">Today's Orders</p>
              <h2 className="text-2xl font-bold">{todayOrders}</h2>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>

          {loading ? (
            <p className="text-center text-gray-400 py-8">Loading orders...</p>
          ) : error ? (
            <p className="text-center text-red-400 py-8">{error}</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              No orders found for the selected filter.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tl-lg">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                        {order.id.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(order.orderDate).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-lg text-green-400 font-semibold">
                        R{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                        {order.paymentMethod.charAt(0).toUpperCase() +
                          order.paymentMethod.slice(1)}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-blue-500 hover:text-blue-300 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {isOrderDetailsModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative">
              <button
                onClick={() => setIsOrderDetailsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center">
                Order Details
              </h2>
              <div className="space-y-3 mb-6">
                <p>
                  <strong>Order ID:</strong>{" "}
                  <span className="text-gray-400">{selectedOrder.id}</span>
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  <span className="text-gray-400">
                    {new Date(selectedOrder.orderDate).toLocaleString()}
                  </span>
                </p>
                <p>
                  <strong>Payment Method:</strong>{" "}
                  <span className="text-gray-400">
                    {selectedOrder.paymentMethod}
                  </span>
                </p>
                <p>
                  <strong>Total:</strong>{" "}
                  <span className="text-gray-400">
                    R{selectedOrder.totalAmount.toFixed(2)}
                  </span>
                </p>
                {selectedOrder.paymentMethod === "card" && (
                  <p>
                    <strong>Card Fee:</strong>{" "}
                    <span className="text-gray-400">
                      R{selectedOrder.cardFee.toFixed(2)}
                    </span>
                  </p>
                )}
                <h3 className="text-xl font-bold mt-4 mb-2">Items:</h3>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <ul className="list-disc pl-5 max-h-40 overflow-y-auto pr-2">
                    {selectedOrder.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between text-gray-300"
                      >
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>R{(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">
                    No items recorded for this order.
                  </p>
                )}
                <div className="border-t border-gray-600 mt-4 pt-4">
                  <p className="text-2xl font-bold text-green-400 flex justify-between">
                    <span>Total:</span>
                    <span>R{selectedOrder.totalAmount.toFixed(2)}</span>
                  </p>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setIsOrderDetailsModalOpen(false)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPage;