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
        <div className="max-w-4xl mx-auto mt-12 p-10 bg-white rounded-xl shadow-lg border border-gray-200">
            <h1 className="text-4xl font-extrabold mb-8 text-gray-900 border-b pb-4">
                Profile
            </h1>

            <p className="text-xl text-gray-700 mb-10">
                Welcome,{" "}
                <span className="font-semibold text-gray-900">
                    {displayName}
                </span>
            </p>

            {loading ? (
                <p className="text-center text-gray-400 italic">
                    Loading profile data...
                </p>
            ) : (
                <div className="grid grid-cols-2 gap-x-16 gap-y-6 text-gray-800">
                    <div className="flex flex-col space-y-1">
                        <span className="text-sm uppercase text-gray-500 tracking-wide">
                            Elo
                        </span>
                        <span className="text-2xl font-semibold">{elo}</span>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <span className="text-sm uppercase text-gray-500 tracking-wide">
                            Room Tokens
                        </span>
                        <span className="text-2xl font-semibold">
                            {roomtokens}
                        </span>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <span className="text-sm uppercase text-gray-500 tracking-wide">
                            Premium
                        </span>
                        <span
                            className={`text-2xl font-semibold ${
                                ispremium ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {ispremium ? "Yes" : "No"}
                        </span>
                    </div>

                    {instagram && (
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm uppercase text-gray-500 tracking-wide">
                                Instagram
                            </span>
                            <a
                                href={`https://instagram.com/${instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-2xl font-semibold text-blue-600 hover:underline"
                            >
                                @{instagram}
                            </a>
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={handleLogout}
                className="mt-12 w-full max-w-xs mx-auto block bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-md transition duration-300"
            >
                Log Out
            </button>
        </div>
    );
}
