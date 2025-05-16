import { supabase } from "../lib/supabaseClient";

// Fetch all products
export const fetchProducts = async () => {
  const { data, error } = await supabase.from("products").select("*");
  return { data, error };
};

// Upload image and return public URL
export const uploadProductImage = async (imageFile) => {
  const fileExt = imageFile.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `product-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, imageFile);

  if (uploadError) return { error: uploadError, publicUrl: null };

  const { data: publicUrlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return { error: null, publicUrl: publicUrlData.publicUrl };
};

// Add new product
export const addProduct = async (product) => {
  return await supabase.from("products").insert([product]);
};

// Update product
export const updateProduct = async (id, updatedFields) => {
  return await supabase.from("products").update(updatedFields).eq("id", id);
};

// Delete product
export const deleteProduct = async (id) => {
  return await supabase.from("products").delete().eq("id", id);
};
