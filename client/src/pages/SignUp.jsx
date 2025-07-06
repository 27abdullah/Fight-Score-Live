import { useState } from "react";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import GoogleProvider from "../config/OAuth/GoogleOAuth";

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [instagram, setInstagram] = useState(null);
    const [activeTab, setActiveTab] = useState("email");
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
        if (error) {
            navigate(`/signup`, {
                state: {
                    flashMessage: {
                        message: error.message,
                        type: "error",
                    },
                },
            });
        } else {
            navigate(`/login`, {
                state: {
                    flashMessage: {
                        message: `Check your email to confirm your signup!`,
                        type: "info",
                    },
                },
            });
        }
    };

    const inputClassName =
        "bg-dune px-5 py-4 border border-gray-300 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rich_carmine focus:border-rich_carmine transition";

    return (
        <div className="flex items-center justify-center min-h-screen px-6 py-12">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-12 border border-gray-200">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-10 text-center font-industry_demi">
                    Sign Up
                </h1>

                {/* Tabs */}
                <div className="flex border-gray-300 mb-10 space-x-6">
                    <button
                        onClick={() => setActiveTab("email")}
                        className={`flex-1 py-3 text-center font-semibold transition ${
                            activeTab === "email"
                                ? " border-rich_carmine text-rich_carmine"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Email & Password
                    </button>
                    <button
                        onClick={() => setActiveTab("google")}
                        className={`flex-1 py-3 text-center font-semibold transition ${
                            activeTab === "google"
                                ? " border-rich_carmine text-rich_carmine"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Sign Up with Google
                    </button>
                </div>

                {/* Tab content */}
                {activeTab === "email" ? (
                    <form
                        onSubmit={handleSignup}
                        className="flex flex-col space-y-7"
                    >
                        <input
                            required
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            autoComplete="email"
                            className={inputClassName}
                        />
                        <input
                            required
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            autoComplete="new-password"
                            className={inputClassName}
                        />
                        <input
                            required
                            type="text"
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Display Name"
                            autoComplete="given-name"
                            className={inputClassName}
                        />
                        <input
                            type="text"
                            onChange={(e) => setInstagram(e.target.value)}
                            placeholder="Instagram Handle (optional)"
                            className={inputClassName}
                        />
                        <button
                            type="submit"
                            className="w-full bg-rich_carmine hover:bg-rich_carmine/90 text-white font-bold py-4 rounded-lg shadow-md transition duration-300"
                        >
                            Sign Up
                        </button>
                    </form>
                ) : (
                    <div className="flex flex-col items-center space-y-8 px-6">
                        <p className="text-center text-gray-700 text-lg max-w-sm">
                            Sign up quickly and securely using your Google
                            account.
                        </p>
                        <GoogleProvider />
                    </div>
                )}
            </div>
        </div>
    );
}

export default SignUp;
