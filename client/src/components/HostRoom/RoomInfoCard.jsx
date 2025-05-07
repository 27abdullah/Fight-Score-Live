import React from "react";

function RoomInfoCard({ roomData }) {
    const {
        currentRound,
        fighterA,
        fighterB,
        name,
        sport,
        totalRounds,
        winner,
    } = roomData;

    return (
        <div>
            <div className="shadow-lg bg-highlightBackground rounded-lg p-10">
                {" "}
                <div className="flex justify-between items-center mb-4 text-3xl">
                    <span>{fighterA}</span>
                    <span>vs</span>
                    <span>{fighterB}</span>
                </div>
                <p className="text-lg">
                    Current Round: {currentRound} / {totalRounds}
                </p>
                <p className="text-lg">Winner: {winner || "TBD"}</p>
                <p className="text-lg">Sport: {sport}</p>
            </div>
        </div>
    );
}

export default RoomInfoCard;
