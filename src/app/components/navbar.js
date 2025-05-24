import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { logOut, getUser } from "../utils/auth";
import { toast } from "react-hot-toast";
import {
  PackageCheck,
  Home,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const user = await getUser();
      setUser(user);
    };
    checkUser();
  }, [router]);

  const goToAuthWithModal = (type) => {
    router.push(`/auth?modal=${type}`);
    setSidebarOpen(false);
  };

  // Check if on homepage
  const isHome = router.pathname === "/";

  if (isHome) {
    // Top Nav for home page
    return (
      <header className="bg-gray-900 text-white flex items-center justify-between lg:px-10 px-4  h-16 fixed w-full z-20">
        <div
          onClick={() => router.push(user ? "/dashboard" : "/")}
          className="flex items-center cursor-pointer"
        >
          <PackageCheck className="h-8 w-8 text-indigo-500" />
          <span className="ml-2 text-xl font-bold">InStock</span>
        </div>

        <nav className="flex space-x-4">
          <>
            <button
              onClick={() => goToAuthWithModal("login")}
              className="hover:underline cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => goToAuthWithModal("signup")}
              className="bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-500  cursor-pointer"
            >
              Get Started
            </button>
          </>
        </nav>
      </header>
    );
  }

  // Sidebar for other pages
  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden p-4 bg-gray-900 flex justify-between items-center">
        <div
          onClick={() => router.push(user ? "/dashboard" : "/")}
          className="flex items-center cursor-pointer text-white"
        >
          <PackageCheck className="h-8 w-8 text-indigo-500" />
          <span className="ml-2 text-xl font-bold">InStock</span>
        </div>
        <button
          className="text-gray-400 hover:text-white"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar itself */}
      <div
        className={`fixed inset-y-0 right-0 z-30 w-64 transform bg-gray-800 transition duration-300 ease-in-out
        lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-700">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => router.push(user ? "/dashboard" : "/")}
          >
            <PackageCheck className="h-8 w-8 text-indigo-500" />
            <span className="ml-2 text-xl font-bold text-white">InStock</span>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-4 py-5 text-gray-100">
          <nav>
            <div className="space-y-2">
              <div className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase">
                {user ? "Main" : "Welcome"}
              </div>

              {user ? (
                <>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-gray-100 bg-gray-700 rounded-md"
                  >
                    <Home className="w-5 h-5 mr-3" />
                    Dashboard
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-md"
                  >
                    <PackageCheck className="w-5 h-5 mr-3" />
                    Inventory
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-md"
                  >
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    Sales
                  </a>

                  <div className="px-2 py-2 mt-6 text-xs font-semibold text-gray-400 uppercase">
                    Settings
                  </div>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-md"
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </a>
                  <button
                    onClick={() => {
                      logOut();
                      toast.success("Logged out successfully");
                      router.push(`/`);
                    }}
                    className="flex items-center px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-md"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => goToAuthWithModal("login")}
                    className="w-full text-left px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-md"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => goToAuthWithModal("signup")}
                    className="w-full text-left px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-500 rounded-md"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
