import { useEffect, useState } from "react";
import { supabase } from "../app/lib/supabaseClient";

const ProductPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");

    console.log('Data:', data)
    console.log('Error:', error)
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setItems(data);
      console.log("Fetched products:", data);
      
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold underline">Products Page</h1>
    </div>
  );
};
export default ProductPage;
