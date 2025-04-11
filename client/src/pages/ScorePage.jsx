import { useState, useEffect } from "react";
import Round from "../components/ScorePage/Round";
import { socket } from "../config/socket";
import { useParams } from "react-router-dom";
import NameTag from "../components/ScorePage/NameTag";

export function ScorePage() {
    const [totalRounds, setTotalRounds] = useState(5);
    const [currentRound, setcurrentRound] = useState(1);
    const [loading, setLoading] = useState(true);
    const [fighterA, setFighterA] = useState("");
    const [fighterB, setFighterB] = useState("");
    const [winner, setWinner] = useState("");
    const { id } = useParams();

    useEffect(() => {
        if (!id) {
            return;
        }

        socket.connect();
        socket.emit("register", id);

        // Socket listener to increment round
        const incRound = () => {
            if (currentRound <= totalRounds) {
                setcurrentRound((round) => round + 1);
            }
        };
        socket.on("incRound", incRound);

        // Socket listener to initalise state
        const init = (state) => {
            setTotalRounds(() => state.totalRounds);
            setcurrentRound(() => state.currentRound);
            setFighterA(() => state.fighterA);
            setFighterB(() => state.fighterB);
            setLoading(() => false);
            setWinner(() => state.winner);
        };
        socket.on("init", init);

        const clearStorage = () => {
            sessionStorage.clear();
        };
        socket.on("clearStorage", clearStorage);

        socket.on("winner", setWinner);

        // Ready to receive init state from server
        socket.emit("ready", id, (response) => {
            init(response);
        });

        return () => {
            socket.off("incRound", incRound);
            socket.off("init", init);
            socket.off("clearStorage", clearStorage);
            socket.off("winner", setWinner);
            socket.disconnect();
        };
    }, []);

    const blocks = Array.from({ length: totalRounds }, (_, i) => i + 1);
    return loading ? (
        <h1>Loading...</h1>
    ) : (
        <div className="flex flex-col items-center justify-center">
            <NameTag name={fighterA} id={"A"} isWinner={winner} />
            <div className="flex items-center justify-center h-[75vh]">
                {blocks.map((i, _) => (
                    <Round
                        key={i}
                        blockRound={i}
                        currentRound={currentRound}
                        totalRounds={totalRounds}
                        socket={socket}
                        id={id}
                        winner={winner}
                    />
                ))}
            </div>
            <NameTag name={fighterB} id={"B"} isWinner={winner} />
        </div>
    );
}

export default ScorePage;
