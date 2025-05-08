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
                    <span>{"/"}</span>
                    <span>{fighterB}</span>
                </div>
                <p className="text-lg">
                    {currentRound <= totalRounds
                        ? `Current Round: ${currentRound} / ${totalRounds}`
                        : `Fight Finished`}
                </p>
                <p className="text-lg">
                    {winner
                        ? `Winner: ${winner == "A" ? fighterA : fighterB}`
                        : ""}
                </p>
            </div>
        </div>
    );
}

export default RoomInfoCard;
