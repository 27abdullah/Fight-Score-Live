import { supabase } from "../supabaseClient";

const signUpGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
    });
};

export default signUpGoogle;
