import { useState } from "react";

export default function Broadcast({ user, roomId, token }) {
    const [message, setMessage] = useState("");
    const [wait, setWait] = useState(false);

    const handleClick = async () => {
        if (message == "") {
            return;
        }

        try {
            setMessage("");
            setWait(true);
            const fullMessage = `${
                user.user_metadata.display_name || user.user_metadata.full_name
            } (Host): ${message}`;
            const res = await fetch(`http://localhost:4000/api/host-message/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message: fullMessage,
                    id: roomId,
                }),
            });
            const data = await res.json();
            setTimeout(() => setWait(false), 1000 * 60 * 5); // 5 minutes
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div className="flex items-center mt-4 rounded-lg">
            <input
                type="text"
                maxLength={20}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-700"
                placeholder="Type here..."
            />
            <button
                disabled={wait}
                onClick={handleClick}
                className={`px-4 py-2 mx-2  text-white rounded-lg ${
                    wait
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-red-900 hover:bg-red-1000"
                }`}
            >
                Broadcast
            </button>
        </div>
    );
}
