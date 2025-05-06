import InfoCard from "../components/Room/InfoCard.jsx";
import { useEffect, useState } from "react";

function Rooms() {
    const [liveRooms, setLiveRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiveRooms = async () => {
            const response = await fetch(
                "http://localhost:4000/api/live-fights"
            );
            const data = await response.json();
            setLiveRooms(data);
            setLoading(false);
        };

        fetchLiveRooms();
    }, []);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-10">
            {liveRooms.map((room, i) => (
                <InfoCard
                    key={i}
                    id={room.id}
                    eventName={room.name}
                    fighterA={room.fighterA}
                    fighterB={room.fighterB}
                    sport={room.sport}
                    currentRound={
                        room.state == 0 ? room.currentRound : "Finished"
                    }
                    owner={room.owner}
                />
            ))}
        </div>
    );
}

export default Rooms;
