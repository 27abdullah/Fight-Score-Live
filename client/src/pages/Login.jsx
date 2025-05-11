import { useState } from "react";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import GoogleProvider from "../config/OAuth/GoogleOAuth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) alert(error.message);
        else navigate("/profile");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center m-4">
                <form onSubmit={handleLogin} className="flex flex-col">
                    <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="mb-2"
                        autoComplete="email"
                    />
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="mb-2"
                        autoComplete="current-password"
                    />
                    <button type="submit">Log In</button>
                </form>
            </div>
            <div>
                <GoogleProvider />
            </div>
        </div>
    );
}
