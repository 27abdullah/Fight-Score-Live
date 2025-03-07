import { useState, useEffect } from "react";
import Round from "../components/ScorePage/Round";
import { socket } from "../socket";
import { useSearchParams } from "react-router-dom";
import NameTag from "../components/ScorePage/NameTag";

export function ScorePage() {
    const [totalRounds, setTotalRounds] = useState(5);
    const [currRound, setCurrRound] = useState(1);
    const [loading, setLoading] = useState(true);
    const [fighterA, setFighterA] = useState("");
    const [fighterB, setFighterB] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get("id");

    useEffect(() => {
        socket.connect();
        socket.emit("register", id);

        // Socket listener to increment round
        const incRound = () => {
            if (currRound <= totalRounds) {
                setCurrRound((round) => round + 1);
            }
        };
        socket.on("incRound", incRound);

        // Socket listener to initalise state
        const init = (state) => {
            if (state.clear) {
                sessionStorage.clear();
            }
            setTotalRounds(() => state.totalRounds);
            setCurrRound(() => state.currRound);
            setFighterA(() => state.fighterA);
            setFighterB(() => state.fighterB);
            setLoading(() => false);
        };
        socket.on("init", init);

        // Ready to receive init state from server
        socket.emit("ready", id, (response) => {
            init(response);
        });

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
        <div className="flex flex-col items-center justify-center">
            <NameTag name={fighterA} />
            <div className="flex items-center justify-center h-[75vh]">
                {blocks.map((i, _) => (
                    <Round
                        key={i}
                        blockRound={i}
                        currRound={currRound}
                        totalRounds={totalRounds}
                        socket={socket}
                        id={id}
                    />
                ))}
            </div>
            <NameTag name={fighterB} />
        </div>
    );
}

export default ScorePage;
