import InfoCard from "../components/Room/InfoCard.jsx";

function Rooms() {
    const rooms = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
        <div className="flex flex-col items-center justify-center space-y-10">
            {rooms.map((i, _) => (
                <InfoCard
                    key={i}
                    eventName={"Fury vs Usyk"}
                    eventDescription={
                        "Heavyweight championship of the world, hosted in Riyadh"
                    }
                    hostName={"Host: John Doe"}
                />
            ))}
        </div>
    );
}

export default Rooms;
