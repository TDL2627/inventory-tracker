import { supabase } from "../lib/supabaseClient";

// Fetch all orders owned by a specific email
export const fetchOrders = async (ownerEmail) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("ownerEmail", ownerEmail);

  return { data, error };
};

// Add a new order
export const addOrder = async (order) => {
  return await supabase.from("orders").insert([order]);
};

// Update an existing order
export const updateOrder = async (id, updatedFields) => {
  return await supabase.from("orders").update(updatedFields).eq("id", id);
};

// Delete an order
export const deleteOrder = async (id) => {
  return await supabase.from("orders").delete().eq("id", id);
};
