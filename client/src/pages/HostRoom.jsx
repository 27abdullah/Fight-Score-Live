import { useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { useParams } from "react-router-dom";
import { useState } from "react";
import RoomInfoCard from "../components/HostRoom/RoomInfoCard";
import Controls from "../components/HostRoom/Controls";

function HostRoom() {
    const { user, token } = useUser();
    const { id: roomId } = useParams();
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (!roomId || !token || !user) {
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
                setRoomData(data.cardState);
                setLoading(false);
            } else {
                console.error("Failed to fetch room data");
            }
        };

        fetchRoomData();
    }, [token, roomId, user]);

    if (loading || roomData == null) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <div className="flex flex-row justify-center space-x-5 p-10">
                <Controls
                    roomData={roomData}
                    setRoomData={setRoomData}
                    roomId={roomId}
                    token={token}
                    setStats={setStats}
                />
                <RoomInfoCard
                    roomData={roomData}
                    token={token}
                    roomId={roomId}
                />
            </div>
        </>
    );
}

export default HostRoom;
