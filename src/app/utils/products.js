import { supabase } from "../lib/supabaseClient";

// Fetch all products
export const fetchProducts = async (email) => {
  
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("ownerEmail", email);

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
export const addProduct = async (product, email) => {  
  const productWithOwner = {
    ...product,
    ownerEmail: email,
  };
  return await supabase.from("products").insert([productWithOwner]);
};

// Update product
export const updateProduct = async (id, updatedFields) => {
  return await supabase.from("products").update(updatedFields).eq("id", id);
};

// Delete product
export const deleteProduct = async (id) => {
  return await supabase.from("products").delete().eq("id", id);
};
