import { useState } from "react";
import { motion } from "framer-motion";

export default function LiveButton({ roomId, token }) {
    const placeholder = "Get Live User Count";
    const [response, setResponse] = useState(placeholder);

    const handleClick = async () => {
        try {
            const res = await fetch(
                `http://localhost:4000/api/user-count/${roomId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            setResponse(`There are ${data.res} active users!`);
            setTimeout(() => setResponse(placeholder), 3000);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <>
            <div className="relative flex items-center justify-center mt-4">
                <motion.button
                    className="p-2 bg-red-900 rounded-full hover:bg-red-1000 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={handleClick}
                    whileTap={{ scale: 0.9 }}
                >
                    {response}
                </motion.button>
            </div>
        </>
    );
}
