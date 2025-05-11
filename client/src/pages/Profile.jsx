// src/pages/Profile.js
import { useUser } from "../hooks/useUser";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Profile() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [elo, setElo] = useState(null);
    const [roomtokens, setRoomTokens] = useState(null);
    const [ispremium, setIsPremium] = useState(null);
    const [instagram, setInstagram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [displayName, setDisplayName] = useState(null);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    useEffect(() => {
        async function fetchUserData() {
            const { data, error } = await supabase
                .from("profiles")
                .select("ispremium, roomtokens, elo, instagram, display_name")
                .single();

            if (!error) {
                setElo(data.elo);
                setRoomTokens(data.roomtokens);
                setIsPremium(data.ispremium);
                setInstagram(data.instagram);
                setDisplayName(data.display_name);
                setLoading(false);
            }
        }
        fetchUserData();
    }, []);

    return (
        <div>
            <h1>Profile</h1>
            <p>Welcome, {displayName}</p>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <p>Elo: {elo}</p>
                    <p>Room Tokens: {roomtokens}</p>
                    <p>Is Premium: {ispremium ? "Yes" : "No"}</p>
                    {instagram && <p>Instagram: {instagram}</p>}
                </div>
            )}
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
}
