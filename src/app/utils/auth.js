import { supabase } from "../lib/supabaseClient";

export async function signUp(
  email,
  password,
  role = "teller",
  name = "",
  ownerEmail = ""
) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const { data, error } = await supabase.auth.signUp({ email: normalizedEmail, password });
  if (error) {
    // eslint-disable-next-line no-console
    console.error("Supabase signUp error", { error });
    throw new Error(`Supabase signUp failed: ${error.message}`);
  }

  const userId = data.user?.id;

  if (userId) {
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ role, name, email: normalizedEmail, id: userId, ownerEmail }]);
    if (insertError) {
      // eslint-disable-next-line no-console
      console.error("Insert into users failed", { insertError, payload: { role, name, email, id: userId, ownerEmail } });
      throw new Error(`Insert profile failed: ${insertError.message}`);
    }
  } else {
    // eslint-disable-next-line no-console
    console.error("No user id returned from signUp", { data });
    throw new Error("Sign up did not return a user id");
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
