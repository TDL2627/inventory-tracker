import { useState, useEffect } from "react";
import { signIn, signUp } from "../app/utils/auth";
import { useRouter } from "next/router";

export default function AuthPage() {
  const [activeModal, setActiveModal] = useState(null);
  const router = useRouter();

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

  const openModal = (type) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  const handleSignup = async () => {
    try {
      await signUp(
        signupData.email,
        signupData.password,
        signupData.role,
        signupData.name
      );
      alert("Signed up!");
      closeModal();
      router.push("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signIn(loginData.email, loginData.password);
      alert("Logged in!");
      closeModal();
      router.push("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const { modal } = router.query;
      if (modal === "signup" || modal === "login") {
        setActiveModal(modal);
      }
    }
  }, [router.isReady, router.query]);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Welcome to Auth Page</h1>

      <div className="flex gap-4">
        <button
          onClick={() => openModal("signup")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium"
        >
          Sign Up
        </button>
        <button
          onClick={() => openModal("login")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium"
        >
          Login
        </button>
      </div>

      {/* Signup Modal */}
      {activeModal === "signup" && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Sign Up</h3>
            </div>

            <div className="px-6 py-4 flex flex-col gap-4">
              <input
                placeholder="Name"
                className="p-2 rounded bg-gray-700 text-white border border-gray-600"
                onChange={(e) =>
                  setSignupData({ ...signupData, name: e.target.value })
                }
              />
              <input
                placeholder="Email"
                className="p-2 rounded bg-gray-700 text-white border border-gray-600"
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                className="p-2 rounded bg-gray-700 text-white border border-gray-600"
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
              />
              <select
                className="p-2 rounded bg-gray-700 text-white border border-gray-600"
                value={signupData.role}
                onChange={(e) =>
                  setSignupData({ ...signupData, role: e.target.value })
                }
              >
                <option value="teller">Teller</option>
                <option value="owner">Owner</option>
              </select>
            </div>

            <div className="px-6 py-3 bg-gray-900 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSignup}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {activeModal === "login" && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Login</h3>
            </div>

            <div className="px-6 py-4 flex flex-col gap-4">
              <input
                placeholder="Email"
                className="p-2 rounded bg-gray-700 text-white border border-gray-600"
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                className="p-2 rounded bg-gray-700 text-white border border-gray-600"
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
            </div>

            <div className="px-6 py-3 bg-gray-900 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
