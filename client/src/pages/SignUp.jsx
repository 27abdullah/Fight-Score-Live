import { useState } from "react";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import GoogleProvider from "../config/OAuth/GoogleOAuth";

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [instagram, setInstagram] = useState(null);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: displayName,
                    instagram: instagram,
                },
            },
        });
        if (error) alert(error.message);
        else {
            alert("Check your email to confirm signup!");
            navigate("/login");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center m-4">
                <form onSubmit={handleSignup} className="flex flex-col">
                    <input
                        required
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="mb-2"
                        autoComplete="email"
                    />
                    <input
                        required
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="mb-2"
                        autoComplete="new-password"
                    />
                    <input
                        required
                        type="text"
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Display Name"
                        className="mb-2"
                        autoComplete="given-name"
                    />
                    <input
                        required
                        type="text"
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="Instgram Handle (optional)"
                        className="mb-2"
                    />
                    <button type="submit">Sign Up</button>
                </form>
            </div>
            <div>
                <GoogleProvider />
            </div>
        </div>
    );
}

export default SignUp;
