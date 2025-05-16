import { useNavigate } from "react-router-dom";

export default function HostRoomButton({
    id,
    token,
    eventName,
    handleNavigate,
}) {
    const navigate = useNavigate();
    const deleteCard = async () => {
        const body = { id };
        const response = await fetch(`http://localhost:4000/api/end-card`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        if (data.end) {
            forcePageReload();
            navigate(`/rooms`, {
                state: {
                    flashMessage: {
                        message: `You have deleted ${eventName}!`,
                        type: "info",
                    },
                },
            });
        }
    };

    const forcePageReload = () => {
        window.location.reload();
    };

    return (
        <div className="flex items-center gap-4 justify-end">
            <a
                onClick={() => handleNavigate("host-room", id)}
                className="inline-flex hover:text-red-200 items-center px-3 hover:cursor-pointer py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
                Host room
                <svg
                    className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                >
                    <circle
                        cx="7"
                        cy="5"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                </svg>
            </a>
            {/* <p className="w-20 text-right">{sport}</p> */}
            <button className="bg-black text-xs p-3" onClick={deleteCard}>
                Delete
            </button>
        </div>
    );
}
