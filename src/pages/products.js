import { useEffect, useState } from "react";
import {
  fetchProducts,
  uploadProductImage,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../app/utils/products";
import toast from "react-hot-toast";
import { useUserStore } from "../app/stores/user";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // You can adjust this
  const user = useUserStore((state) => state.user);

  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    imageFile: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadProducts = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await fetchProducts(user.email);

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [user]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const toastId = toast.loading("Adding product...");
    let imageUrl = null;

    if (productForm.imageFile) {
      const { error, publicUrl } = await uploadProductImage(
        productForm.imageFile
      );
      if (error) {
        toast.error("Image upload failed", { id: toastId });
        console.error("Image upload error:", error);
        setIsLoading(false);
        return;
      }
      imageUrl = publicUrl;
    }

    const { error } = await addProduct(
      {
        name: productForm.name,
        category: productForm.category,
        price: parseFloat(productForm.price),
        quantity: parseInt(productForm.quantity),
        image_url: imageUrl,
      },
      user?.email
    );

    if (error) {
      toast.error("Failed to add product", { id: toastId });
      console.error("Error adding product:", error);
    } else {
      toast.success("Product added!", { id: toastId });
      resetForm();
      setActiveModal("");
      loadProducts();
    }

    setIsLoading(false);
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const toastId = toast.loading("Saving changes...");
    setIsLoading(true);

    let updatedFields = {
      name: productForm.name,
      category: productForm.category,
      price: parseFloat(productForm.price),
      quantity: parseInt(productForm.quantity),
    };

    if (productForm.imageFile) {
      const { error, publicUrl } = await uploadProductImage(
        productForm.imageFile
      );
      if (error) {
        toast.error("Image upload failed", { id: toastId });
        console.error("Image upload error:", error);
        setIsLoading(false);
        return;
      }
      updatedFields.image_url = publicUrl;
    }

    const { error } = await updateProduct(selectedProduct.id, updatedFields);

    if (error) {
      toast.error("Failed to update product", { id: toastId });
      console.error("Error updating product:", error);
    } else {
      toast.success("Product updated!", { id: toastId });
      resetForm();
      setActiveModal("");
      setSelectedProduct(null);
      loadProducts();
    }

    setIsLoading(false);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    const toastId = toast.loading("Deleting product...");
    setIsLoading(true);

    const { error } = await deleteProduct(selectedProduct.id);

    if (error) {
      toast.error("Failed to delete product", { id: toastId });
      console.error("Error deleting product:", error);
    } else {
      toast.success("Product deleted!", { id: toastId });
      setActiveModal("");
      setSelectedProduct(null);
      loadProducts();
    }

    setIsLoading(false);
  };

  const openAddModal = () => {
    resetForm();
    setActiveModal("add");
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price?.toString() || "",
      quantity: product.quantity?.toString() || "",
    });
    setActiveModal("edit");
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setActiveModal("delete");
  };

  const closeModal = () => {
    setActiveModal("");
    if (activeModal === "delete" || activeModal === "edit") {
      setSelectedProduct(null);
    }
    resetForm();
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      category: "",
      price: "",
      quantity: "",
      imageFile: null,
    });
  };
  return (
    <div className="flex flex-col h-full bg-black text-gray-200">
      {/* Header */}
      <header className="">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">
            Inventory Management
          </h1>

          <div className="my-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <input
              type="text"
              placeholder="Search by name"
              className="px-4 py-2 bg-gray-800 text-gray-200 rounded w-full sm:max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="px-4 py-2 bg-gray-800 text-gray-200 rounded w-full sm:max-w-xs"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {[...new Set(products.map((p) => p.category))].map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Add New Product
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="bg-black shadow overflow-hidden sm:rounded-lg border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => {
                      const status =
                        product.quantity === 0
                          ? "Out of Stock"
                          : product.quantity < 10
                          ? "Low Stock"
                          : "In Stock";

                      const statusColor =
                        status === "In Stock"
                          ? "bg-green-100 text-green-800"
                          : status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800";

                      return (
                        <tr key={product.id} className="hover:bg-gray-750">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {product.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            R{product.price?.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {product.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-12 w-12 object-cover rounded"
                              />
                            ) : (
                              <span className="text-gray-400 text-sm">
                                No Image
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <button
                              onClick={() => openEditModal(product)}
                              className="text-red-400 hover:text-red-300 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteModal(product)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-4 text-center text-sm text-gray-400"
                      >
                        No products found. Add a new product to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
            <div className="flex justify-between items-center mt-4 text-gray-300">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 cursor-pointer bg-gray-800 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 cursor-pointer bg-gray-800 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      {/* Product Form Modal (Add/Edit) */}
      {(activeModal === "add" || activeModal === "edit") && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-black rounded-lg shadow-xl max-w-md w-full border border-gray-800">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">
                {activeModal === "add" ? "Add New Product" : "Edit Product"}
              </h3>
            </div>

            <form
              onSubmit={
                activeModal === "add" ? handleAddProduct : handleEditProduct
              }
            >
              <div className="px-6 py-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 text-white"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 text-white"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Price (R)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 text-white"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={productForm.quantity}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        quantity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        imageFile: e.target.files[0],
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  />
                </div>
              </div>

              <div className="px-6 py-3 bg-black flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border cursor-pointer border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {activeModal === "add" ? "Add Product" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {activeModal === "delete" && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-black rounded-lg shadow-xl max-w-md w-full border border-gray-800">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Confirm Delete</h3>
            </div>

            <div className="px-6 py-4">
              <p className="text-sm text-gray-300">
                Are you sure you want to delete{" "}
                <span className="font-medium text-white">
                  {selectedProduct.name}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="px-6 py-3 bg-black flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={closeModal}
                className="px-4 py-2 border cursor-pointer border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
