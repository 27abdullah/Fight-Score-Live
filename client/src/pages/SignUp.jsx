import { useState } from "react";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: displayName,
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
        <form onSubmit={handleSignup}>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <input
                type="text"
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
            />
            <button type="submit">Sign Up</button>
        </form>
    );
}

export default SignUp;
