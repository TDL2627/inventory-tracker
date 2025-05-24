import { useEffect, useState } from "react";
import {
  fetchProducts,
  uploadProductImage,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../app/utils/products";
import { getUser } from "../app/utils/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    imageFile: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getUser();
      console.log(user,"aye use");
      
      if (!user) {
        router.push("/auth");
      }
      setUser(user);
    };
    checkUser();
  }, [router]);

  const loadProducts = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await fetchProducts(user.id);

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

    const { error } = await addProduct({
      name: productForm.name,
      category: productForm.category,
      price: parseFloat(productForm.price),
      quantity: parseInt(productForm.quantity),
      image_url: imageUrl,
    }, user?.id);

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
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
      {/* Header */}
      <header className="">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">
              Inventory Management
            </h1>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-indigo-600 cursor-pointer text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-600">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {product.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          R{product.price?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {product.quantity}
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

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openEditModal(product)}
                            className="text-indigo-400 hover:text-indigo-300 mr-4 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(product)}
                            className="text-red-400 hover:text-red-300 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
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
      </main>

      {/* Product Form Modal (Add/Edit) */}
      {(activeModal === "add" || activeModal === "edit") && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
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
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
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
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
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
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
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
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-900 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border cursor-pointer border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
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

            <div className="px-6 py-3 bg-gray-900 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={closeModal}
                className="px-4 py-2 border cursor-pointer border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
