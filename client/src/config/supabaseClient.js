import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Avoid recreating the client on hot reload
let supabase;

if (!window.__supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    window.__supabase = supabase;
} else {
    supabase = window.__supabase;
}

export { supabase };
