import { useState, useEffect } from "react";
import io from "socket.io-client";
import Round from "../components/Round";
import { useLocation } from "react-router-dom";
import { socket } from "../socket";

export function ScorePage() {
    const [totalRounds, setTotalRounds] = useState(5);
    const [currRound, setCurrRound] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        socket.connect();

        // Socket listener to increment round
        const incRound = (data) => {
            setCurrRound((round) => round + 1);
        };
        socket.on("incRound", incRound);

        // Socket listener to initalise state
        const init = (state) => {
            setTotalRounds(() => state.totalRounds);
            setCurrRound(() => state.currRound);
            setLoading(() => false);
            console.log("Current round on init ==" + currRound);
        };
        socket.on("init", init);

        // Ready to receive init state from server
        socket.emit("ready");

        return () => {
            socket.off("incRound", incRound);
            socket.off("init", init);
            console.log("disconnect");
            socket.disconnect();
        };
    }, []);

    const blocks = Array.from({ length: totalRounds }, (_, i) => i + 1);
    return loading ? (
        <h1>Loading...</h1>
    ) : (
        <>
            <div className="flex items-center justify-center h-[75vh]">
                {blocks.map((i, _) => (
                    <Round
                        key={i}
                        blockRound={i}
                        currRound={currRound}
                        totalRounds={totalRounds}
                        socket={socket}
                    />
                ))}
            </div>
        </>
    );
}

export default ScorePage;
