import { useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { useParams } from "react-router-dom";
import { useState } from "react";
import RoomInfoCard from "../components/HostRoom/RoomInfoCard";
import Controls from "../components/HostRoom/Controls";
import StatInfoCard from "../components/HostRoom/StatInfoCard";

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
        return <h1 className="text-lg">Please refresh in a couple seconds</h1>; //TODO make a better
    }

    return (
        <div className="border w-screen h-screen overflow-hidden p-2 flex items-center justify-center">
            <div className="border flex flex-col gap-4 h-full overflow-hidden w-full max-w-2xl">
                <RoomInfoCard
                    roomData={roomData}
                    token={token}
                    roomId={roomId}
                    user={user}
                />
                <Controls
                    roomData={roomData}
                    setRoomData={setRoomData}
                    roomId={roomId}
                    token={token}
                    setStats={setStats}
                />
                <div className="overflow-y-auto min-h-0">
                    <StatInfoCard stats={stats} roomData={roomData} />
                </div>
            </div>
        </div>
    );
}

export default HostRoom;
