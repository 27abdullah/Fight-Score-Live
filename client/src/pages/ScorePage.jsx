import { useState, useEffect } from "react";
import io from "socket.io-client";
import Block from "../components/Block";

const socket = io.connect("http://localhost:4000");

export function ScorePage() {
    const [totalRounds, setTotalRounds] = useState(5);
    const [currRound, setCurrRound] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Socket listener to increment round
        const incRound = (data) => {
            if (currRound <= totalRounds) {
                setCurrRound((round) => round + 1);
            }
        };
        socket.on("incRound", incRound);

        // Socket listener to initalise state
        const init = (state) => {
            setTotalRounds(() => state.totalRounds);
            setCurrRound(() => state.currRound);
            setLoading(() => false);
        };
        socket.on("init", init);

        // Ready to receive init state from server
        socket.emit("ready");

        return () => {
            socket.off("incRound", incRound);
            socket.off("init", init);
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
                    <Block
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
