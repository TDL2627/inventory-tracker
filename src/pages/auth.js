import { useEffect, useState } from "react";
import { signIn, signUp } from "../app/utils/auth";
import { useRouter } from "next/router";
import { Store, User, PackageCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AuthPage() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      const { modal } = router.query;
      if (modal === "signup" || modal === "login") {
        setActiveModal(modal);
        router.replace("/auth", undefined, { shallow: true });
      }
    }
  }, [router.isReady, router.query]);

  const closeModal = () => setActiveModal(null);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    role: "teller",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleSignup = async () => {
    try {
      await signUp(
        signupData.email,
        signupData.password,
        signupData.role,
        signupData.name
      );
      toast.success("Signed up! 🎉");
      closeModal();
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Signup failed");
    }
  };

  const handleLogin = async () => {
    try {
      await signIn(loginData.email, loginData.password);
      toast.success("Logged in! 👏");
      closeModal();
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-4">
      <h2 className="text-4xl font-bold mb-2 text-indigo-400">InStock</h2>
      <p className="text-gray-400 text-center mb-8 max-w-md">
        Manage your stock, sales, and team. Owners can create stores. Tellers
        can help with daily sales and stock tracking.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => setActiveModal("signup")}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium"
        >
          Sign Up
        </button>
        <button
          onClick={() => setActiveModal("login")}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium"
        >
          Login
        </button>
      </div>
      {activeModal && (
        <div className="flex items-center gap-4 cursor-pointer  fixed top-20  z-60">
          <PackageCheck className="h-8 w-8 text-indigo-500" />
          <h1 className="text-4xl font-bold text-white">InStock</h1>
        </div>
      )}
      {/* Signup Modal */}
      {activeModal === "signup" && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40 p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full border border-gray-800">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                Create Your InStock Account
              </h3>
              <p className="text-sm text-gray-400">
                Choose your role to get started
              </p>
            </div>

            <div className="px-6 py-4 space-y-4">
              <input
                placeholder="Full Name"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                onChange={(e) =>
                  setSignupData({ ...signupData, name: e.target.value })
                }
              />
              <input
                placeholder="Email"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
              />

              <div className="text-sm text-gray-400">Select your role:</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className={`flex items-center gap-2 p-2 rounded border ${
                    signupData.role === "owner"
                      ? "bg-indigo-700 border-indigo-500"
                      : "bg-gray-800 border-gray-700"
                  }`}
                  onClick={() =>
                    setSignupData({ ...signupData, role: "owner" })
                  }
                >
                  <Store size={18} />
                  Owner
                </button>
                <button
                  className={`flex items-center gap-2 p-2 rounded border ${
                    signupData.role === "teller"
                      ? "bg-blue-700 border-blue-500"
                      : "bg-gray-800 border-gray-700"
                  }`}
                  onClick={() =>
                    setSignupData({ ...signupData, role: "teller" })
                  }
                >
                  <User size={18} />
                  Teller
                </button>
              </div>

              <div className="text-xs text-gray-500">
                <strong>Owner:</strong> Manages the store, products, and users.{" "}
                <br />
                <strong>Teller:</strong> Logs daily sales and stock changes.
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-800 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => {
                  closeModal;
                  router.push("/");
                }}
                className="px-4 py-2 border cursor-pointer border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSignup}
                className="px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {activeModal === "login" && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40 p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full border border-gray-800">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                Log in to your Account
              </h3>
            </div>

            <div className="px-6 py-4 space-y-4">
              <input
                placeholder="Email"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
            </div>

            <div className="px-6 py-3 bg-gray-800 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => {
                  closeModal;
                  router.push("/");
                }}
                className="px-4 cursor-pointer py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
