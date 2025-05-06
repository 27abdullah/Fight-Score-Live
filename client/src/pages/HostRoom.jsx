import { useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { useParams } from "react-router-dom";

function HostRoom() {
    const { token } = useUser();
    const { id: roomId } = useParams();

    useEffect(() => {
        if (!roomId || !token) {
            return;
        }

        const fetchRoomData = async () => {
            const response = await fetch(
                `http://localhost:4000/api/fetch-room/${roomId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Room data:", data);
            } else {
                console.error("Failed to fetch room data");
            }
        };

        fetchRoomData();
    }, [token]);

    return (
        <div>
            <h1>Host Room</h1>
            <p>This is the host room page.</p>
        </div>
    );
}
export default HostRoom;
