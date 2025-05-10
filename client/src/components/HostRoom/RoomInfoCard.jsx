import React from "react";
import LiveButton from "./LiveButton";
import Broadcast from "./Broadcast";

function RoomInfoCard({ roomData, token, roomId, user }) {
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
                <div className="flex justify-between items-center mb-4 text-3xl">
                    <span>{fighterA}</span>
                    <span>{"/"}</span>
                    <span>{fighterB}</span>
                </div>
                <p className="text-lg">
                    {currentRound <= totalRounds
                        ? `Round: ${currentRound} of ${totalRounds}`
                        : `Fight Finished`}
                </p>
                <p className="text-lg">
                    {winner
                        ? `Winner: ${winner == "A" ? fighterA : fighterB}`
                        : ""}
                </p>
                <Broadcast user={user} roomId={roomId} token={token} />
            </div>
            <LiveButton roomId={roomId} token={token} />
        </div>
    );
}

export default RoomInfoCard;
