import { useEffect, useState } from "react";
import { Plus, Minus, ShoppingCart, Calculator, X, Search } from "lucide-react";
import { fetchProducts, updateProduct } from "../app/utils/products";
import { useUserStore } from "../app/stores/user";
import toast from "react-hot-toast";
import { addOrder } from "@/app/utils/orders";

const TellerPage = () => {
  const user = useUserStore((state) => state.user);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cardFee, setCardFee] = useState(0);
  const [cashGiven, setCashGiven] = useState(0);
  const [changeDue, setChangeDue] = useState(0);

  const loadProducts = async () => {
    if (!user?.ownerEmail) return;
    const { data, error } = await fetchProducts(user.ownerEmail);
    if (error) {
      toast.error("Failed to load products");
      console.error("Fetch products error:", error);
    } else {
      setProducts(data);
    }
  };
  useEffect(() => {
    loadProducts();
  }, [user]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.quantity) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        toast.error("Cannot add more than available stock");
      }
    } else {
      if (product.quantity > 0) {
        setCart([
          ...cart,
          {
            ...product,
            quantity: 1, // this is quantity in cart
            maxQuantity: product.quantity, // total available
          },
        ]);
      } else {
        toast.error("Product is out of stock");
      }
    }
  };

  const updateQuantity = (id, change) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + change;
          if (newQty < 1) return item; // can't go below 1
          if (newQty > item.maxQuantity) {
            toast.error("Exceeds stock");
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (paymentMethod === "card") {
      if (subtotal > 0 && subtotal <= 50) {
        setCardFee(3);
      } else if (subtotal > 50) {
        const hundreds = Math.floor(subtotal / 100);
        const remainder = subtotal % 100;
        const remainderFee = remainder > 50 ? 3 : 0;
        const fee = hundreds * 5 + remainderFee;
        setCardFee(fee);
      } else {
        setCardFee(0);
      }
    } else {
      setCardFee(0);
    }
  }, [subtotal, paymentMethod]);

  const finalTotal = subtotal + cardFee;

  const clearCart = () => {
    setCart([]);
    setPaymentMethod("cash");
  };

  const handleProcessPayment = () => {
    if (cart.length > 0) {
      setIsCheckoutModalOpen(true);
    } else {
      toast.error("Your cart is empty");
    }
  };

  const handleConfirmCheckout = async () => {
    if (paymentMethod === "cash") {
      if (cashGiven < finalTotal) {
        toast.error("Cash given is less than total amount");
        return;
      }
      setChangeDue(cashGiven - finalTotal);
    }
    const toastId = toast.loading("Processing transaction...");

    const updatePromises = cart.map((item) => {
      const newQuantity = item.maxQuantity - item.quantity;
      return updateProduct(item.id, { quantity: newQuantity });
    });

    try {
      const results = await Promise.all(updatePromises);

      const failedUpdate = results.find((result) => result.error);
      if (failedUpdate) {
        throw new Error(
          failedUpdate.error.message || "An unknown database error occurred."
        );
      }

      const orderItems = cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const newOrder = {
        totalAmount: finalTotal,
        cardFee: cardFee,
        paymentMethod: paymentMethod,
        items: orderItems,
        teller: user.name,
        ownerEmail: user.ownerEmail,
      };

      const { error: orderError } = await addOrder(newOrder);

      if (orderError) {
        throw new Error(
          orderError.message ||
            "An unknown database error occurred during order creation."
        );
      }

      toast.success("Payment Successful!", { id: toastId });
      setCashGiven(0);
      setChangeDue(0);
      setIsCheckoutModalOpen(false);
      clearCart();
      await loadProducts();
    } catch (error) {
      toast.error(`Checkout failed: ${error.message}`, { id: toastId });
      await loadProducts();
    }
  };

  const CartComponent = () => (
    <>
      <div className="flex justify-between items-center my-10">
        <h2 className="text-xl font-bold">Current Order</h2>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-red-400 hover:text-red-300 text-sm font-medium cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="space-y-3 mb-6 max-h-92 overflow-y-auto">
        {cart.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No items in cart</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="bg-gray-700 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{item.name}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="bg-gray-600 hover:bg-gray-500 rounded p-1"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 bg-gray-600 rounded min-w-[3rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="bg-gray-600 hover:bg-gray-500 rounded p-1"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="font-bold text-green-400">
                  R{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Calculations */}
      {cart.length > 0 && (
        <div className="border-t border-gray-600 pt-4">
          {/* Payment Method */}
          <div className="flex justify-between items-center mb-4">
            <label htmlFor="paymentMethod" className="text-lg font-medium">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
            </select>
          </div>

          {/* Subtotal */}
          <div className="flex justify-between text-md mb-2">
            <span>Subtotal:</span>
            <span>R{subtotal.toFixed(2)}</span>
          </div>

          {/* Card Fee */}
          {paymentMethod === "card" && (
            <div className="flex justify-between text-md mb-2">
              <span>Card Fee:</span>
              <span className="text-orange-400">R{cardFee.toFixed(2)}</span>
            </div>
          )}
          {paymentMethod === "cash" && (
            <>
              <div className="flex justify-between items-center mt-4">
                <label htmlFor="cashGiven">Cash Given:</label>
                <input
                  type="number"
                  id="cashGiven"
                  className="bg-gray-700 px-3 py-1 rounded text-white w-28 text-right"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(Number(e.target.value))}
                  min={0}
                />
              </div>
              {cashGiven > 0 && cashGiven >= finalTotal && (
                <div className="flex justify-between font-semibold mt-2">
                  <span>Change Due:</span>
                  <span className="text-green-300 font-mono">
                    R{(cashGiven - finalTotal).toFixed(2)}
                  </span>
                </div>
              )}
            </>
          )}
          {/* Total */}
          <div className="flex justify-between text-xl font-bold my-4">
            <span>Total:</span>
            <span className="text-green-400">R{finalTotal.toFixed(2)}</span>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleProcessPayment}
            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Process Payment
          </button>
        </div>
      )}
    </>
  );

  const CheckoutConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg shadow-xl w-11/12 max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Confirm Order</h2>
        <div className="space-y-2 mb-6">
          {/* Itemized List */}
          <div className="max-h-48 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between py-1">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span className="font-mono">
                  R{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-600 my-2 pt-2"></div>
          {/* Financial Summary */}
          <div className="flex justify-between font-semibold">
            <span>Subtotal:</span>
            <span className="font-mono">R{subtotal.toFixed(2)}</span>
          </div>
          {paymentMethod === "card" && (
            <div className="flex justify-between font-semibold">
              <span>Card Fee:</span>
              <span className="font-mono text-orange-400">
                R{cardFee.toFixed(2)}
              </span>
            </div>
          )}
          <div className="border-t border-gray-600 my-2 pt-2"></div>
          <div className="flex justify-between text-2xl font-bold text-green-400">
            <span>Total:</span>
            <span className="font-mono">R{finalTotal.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className=" cursor-pointer px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmCheckout}
            className=" cursor-pointer px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold"
          >
            Confirm & Pay
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-900 text-white mt-10">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Calculator className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">{user?.name}</h1>
          </div>
          <button
            onClick={() => setIsCartModalOpen(true)}
            className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg lg:hidden"
          >
            <ShoppingCart className="w-5 h-5 text-green-400" />
            <span className="text-lg font-semibold">{cart.length} items</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <select
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id} // Assuming each product has a unique ID
                  className="bg-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col transform transition-transform duration-200 hover:scale-105 "
                >
                  <div className="p-4 flex-grow flex flex-col w-full">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {product.name}
                      </h3>
                      {product.image_url && (
                        <div className="relative w-full h-10 mt-5 bg-gray-700 flex items-center justify-end">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain rounded-lg"
                          />
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-400 mb-2">
                      {product.category}
                    </p>

                    <div className="flex items-center mb-4">
                      <span className="text-gray-300 text-sm mr-2">
                        Stock:{" "}
                      </span>
                      <span
                        className={
                          product.quantity > 0
                            ? "text-green-500 font-medium"
                            : "text-red-500 font-medium"
                        }
                      >
                        {product.quantity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-2xl font-bold text-white">
                        R{product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => {
                          if (product.quantity > 0) {
                            addToCart(product);
                            toast.success(`${product.name} added to cart!`);
                          } else {
                            toast.error("Out of stock");
                          }
                        }}
                        className="bg-blue-600 cursor-pointer disabled:cursor-not-allowed hover:bg-blue-700 text-white font-bold h-10 py-2 px-4 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>

          {/* Cart & Calculations - Desktop */}
          <div className="hidden lg:block bg-gray-800 rounded-xl p-6">
            <CartComponent />
          </div>
        </div>

        {/* Cart Modal for Mobile */}
        {isCartModalOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start pt-10">
            <div className="bg-gray-800 rounded-lg shadow-xl w-11/12 max-w-lg p-6 relative">
              <button
                onClick={() => setIsCartModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <CartComponent />
            </div>
          </div>
        )}

        {/* Checkout Confirmation Modal */}
        {isCheckoutModalOpen && <CheckoutConfirmationModal />}
      </div>
    </div>
  );
};

export default TellerPage;
