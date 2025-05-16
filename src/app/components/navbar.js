import { useState } from "react";
import { useRouter } from "next/router";

import { PackageCheck, Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const goToAuthWithModal = (type) => {
    router.push(`/auth?modal=${type}`);
  };

  return (
    <div className=" bg-gray-900 text-gray-100">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div
                  onClick={() => {
                    router.push(`/`);
                  }}
                  className="flex items-center cursor-pointer"
                >
                  <PackageCheck className="h-8 w-8 text-indigo-500" />
                  <span className="ml-2 text-xl font-bold">InStock</span>
                </div>
              </div>
              <div className="hidden md:block">
                {/* Place for desktop links */}
                {/* <div className="ml-10 flex items-baseline space-x-4">
                  <a href="#features" className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-700">Home</a>
                  <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Features</a>
                  <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Pricing</a>
                  <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">About</a>
                </div> */}
              </div>
            </div>
            {router.pathname !== "/auth" &&
              router.pathname !== "/dashboard" && (
                <div className="hidden md:block">
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        goToAuthWithModal("login");
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        goToAuthWithModal("signup");
                      }}
                      className="ml-3 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md cursor-pointer"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              )}
            {router.pathname !== "/auth" && (
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              Mobile Links
              {/* <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Features
              </a> */}
            </div>
            {router.pathname !== "/auth" &&
              router.pathname !== "/dashboard" && (
                <div className="pt-4 pb-3 border-t border-gray-700">
                  <div className="px-2 space-y-1">
                    <button
                      onClick={() => {
                        goToAuthWithModal("login");
                        setMobileMenuOpen(!mobileMenuOpen);
                      }}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => {
                        goToAuthWithModal("signup");
                        setMobileMenuOpen(!mobileMenuOpen);
                      }}
                      className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-500"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              )}
          </div>
        )}
      </nav>
    </div>
  );
};
export default Navbar;
