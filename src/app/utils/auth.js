import { supabase } from "../lib/supabaseClient";
import { useUserStore } from "../stores/user";

export async function signUp(
  email,
  password,
  role = "teller",
  name = "",
  ownerEmail = ""
) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const userId = data.user?.id;

  if (userId) {
    await supabase
      .from("users")
      .insert([{ role, name, email, id: userId, ownerEmail }]);
  }

  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function getUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("name, role, id, email, ownerEmail")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return data;
}

export async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("name, role, id, email, ownerEmail")
    .eq("email", email)
    .single();

  if (error) throw error;

  return data;
}

export async function logOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
  return;
}
