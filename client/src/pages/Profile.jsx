// src/pages/Profile.js
import { useUser } from "../hooks/useUser";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { user } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <div>
            <h1>Profile</h1>
            <p>Welcome, {user.email}</p>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
}
