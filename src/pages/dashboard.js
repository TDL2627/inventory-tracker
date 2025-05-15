import { useState } from 'react';
import { 
  BarChart3, 
  PackageCheck, 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  Home, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Plus,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for charts and tables
const stockData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1100 },
];

const inventoryItems = [
  { id: 1, name: 'Office Chair', sku: 'FRN-001', category: 'Furniture', stock: 24, price: 249.99, status: 'In Stock' },
  { id: 2, name: 'Wireless Keyboard', sku: 'ELC-032', category: 'Electronics', stock: 15, price: 59.99, status: 'In Stock' },
  { id: 3, name: 'Desk Lamp', sku: 'LGT-103', category: 'Lighting', stock: 8, price: 34.99, status: 'Low Stock' },
  { id: 4, name: 'Monitor Stand', sku: 'FRN-089', category: 'Furniture', stock: 0, price: 79.99, status: 'Out of Stock' },
  { id: 5, name: 'USB Hub', sku: 'ELC-217', category: 'Electronics', stock: 32, price: 25.99, status: 'In Stock' },
  { id: 6, name: 'Wireless Mouse', sku: 'ELC-045', category: 'Electronics', stock: 5, price: 29.99, status: 'Low Stock' },
];

const recentActivities = [
  { id: 1, action: 'Stock Updated', item: 'Office Chair', user: 'Sarah Johnson', time: '2 hours ago' },
  { id: 2, action: 'New Item Added', item: 'USB Hub', user: 'Michael Chen', time: '3 hours ago' },
  { id: 3, action: 'Order Placed', item: 'Wireless Keyboard (x10)', user: 'Emma Wilson', time: '5 hours ago' },
  { id: 4, action: 'Item Removed', item: 'Desk Mat', user: 'Sarah Johnson', time: '1 day ago' },
];

export default function InventoryDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gray-800 transition duration-300 ease-in-out lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-700">
          <div className="flex items-center">
            <PackageCheck className="h-8 w-8 text-indigo-500" />
            <span className="ml-2 text-xl font-bold">InventoryPro</span>
          </div>
          <button 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="px-4 py-5">
          <nav>
            <div className="space-y-2">
              <div className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase">Main</div>
              <a href="#" className="flex items-center px-4 py-2 text-gray-100 bg-gray-700 rounded-md">
                <Home className="w-5 h-5 mr-3" />
                Dashboard
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-md">
                <PackageCheck className="w-5 h-5 mr-3" />
                Inventory
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-md">
                <ShoppingCart className="w-5 h-5 mr-3" />
                Orders
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-md">
                <Users className="w-5 h-5 mr-3" />
                Suppliers
              </a>
              
              <div className="px-2 py-2 mt-6 text-xs font-semibold text-gray-400 uppercase">Settings</div>
              <a href="#" className="flex items-center px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-md">
                <Settings className="w-5 h-5 mr-3" />
                Preferences
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-md">
                <User className="w-5 h-5 mr-3" />
                Profile
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-md">
                <LogOut className="w-5 h-5 mr-3" />
                Log Out
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center lg:hidden">
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search inventory..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-1 mr-4 text-gray-400 rounded-full hover:text-white focus:outline-none">
                <Bell className="h-6 w-6" />
              </button>
              <div className="relative">
                <button className="flex items-center text-sm focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="font-medium">SJ</span>
                  </div>
                  <span className="ml-2 hidden md:block font-medium">Sarah Johnson</span>
                  <ChevronDown className="ml-1 h-4 w-4 hidden md:block" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          {/* Welcome & Date */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, Sarah</h1>
              <p className="text-gray-400">Here's what's happening with your inventory today.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-gray-800 rounded-md px-4 py-2 text-sm font-medium text-gray-300">
                Thursday, May 15, 2025
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-300">Total Products</h2>
                <div className="bg-indigo-600/20 text-indigo-400 p-2 rounded-md">
                  <PackageCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">1,254</span>
                  <div className="flex items-center mt-1 text-sm">
                    <span className="flex items-center text-green-500">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>4.6%</span>
                    </span>
                    <span className="text-gray-400 ml-2">vs last month</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-300">Stock Value</h2>
                <div className="bg-green-600/20 text-green-400 p-2 rounded-md">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">$126.4K</span>
                  <div className="flex items-center mt-1 text-sm">
                    <span className="flex items-center text-green-500">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>12.3%</span>
                    </span>
                    <span className="text-gray-400 ml-2">vs last month</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-300">Low Stock Items</h2>
                <div className="bg-yellow-600/20 text-yellow-400 p-2 rounded-md">
                  <ShoppingCart className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">24</span>
                  <div className="flex items-center mt-1 text-sm">
                    <span className="flex items-center text-red-500">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>8.4%</span>
                    </span>
                    <span className="text-gray-400 ml-2">vs last month</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-300">Out of Stock</h2>
                <div className="bg-red-600/20 text-red-400 p-2 rounded-md">
                  <PackageCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">7</span>
                  <div className="flex items-center mt-1 text-sm">
                    <span className="flex items-center text-red-500">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      <span>2.1%</span>
                    </span>
                    <span className="text-gray-400 ml-2">vs last month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts & Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Stock Trend Chart */}
            <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-white">Stock Trends</h2>
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
                        backgroundColor: '#1F2937', 
                        borderColor: '#374151',
                        color: '#F9FAFB'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#6366F1" 
                      strokeWidth={2} 
                      dot={{ r: 4, fill: '#6366F1' }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-white">Recent Activities</h2>
                <button className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-gray-100">{activity.action}</span>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {activity.item} by {activity.user}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a href="#" className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300">
                  View all activities
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h2 className="text-lg font-medium text-white mb-4 md:mb-0">Inventory Items</h2>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search items..." 
                      className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-auto"
                    />
                  </div>
                  <button className="flex items-center justify-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-300 hover:bg-gray-600">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {inventoryItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${item.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === 'In Stock' 
                            ? 'bg-green-100 text-green-800' 
                            : item.status === 'Low Stock'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <button className="text-indigo-400 hover:text-indigo-300">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of <span className="font-medium">24</span> results
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-300 hover:bg-gray-600 disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-500">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}