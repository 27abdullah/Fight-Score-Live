import { useState, useEffect, useRef } from "react";
import Round from "../components/ScorePage/Round";
import { useParams } from "react-router-dom";
import NameTag from "../components/ScorePage/NameTag";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export function ScorePage() {
    const [totalRounds, setTotalRounds] = useState(5);
    const [currentRound, setcurrentRound] = useState(1);
    const [loading, setLoading] = useState(true);
    const [fighterA, setFighterA] = useState("");
    const [fighterB, setFighterB] = useState("");
    const [winner, setWinner] = useState("");
    const { id: roomId } = useParams();
    const { user, token } = useUser();
    const navigate = useNavigate();
    const socket = useRef(null);

    useEffect(() => {
        if (!user || !roomId) {
            navigate("/");
            return;
        }

        socket.current = io("http://localhost:4000", {
            autoConnect: false,
            extraHeaders: {
                Authorization: `Bearer ${token}`,
                roomid: roomId,
            },
        });
        socket.current.connect();

        // Socket listener to increment round
        const incRound = () => {
            if (currentRound <= totalRounds) {
                setcurrentRound((round) => round + 1);
            }
        };
        socket.current.on("incRound", incRound);

        // Socket listener to initalise state
        const init = (state) => {
            setTotalRounds(() => state.totalRounds);
            setcurrentRound(() => state.currentRound);
            setFighterA(() => state.fighterA);
            setFighterB(() => state.fighterB);
            setLoading(() => false);
            setWinner(() => state.winner);
        };
        socket.current.on("init", init);

        const clearStorage = () => {
            sessionStorage.clear();
        };
        socket.current.on("clearStorage", clearStorage);

        socket.current.on("winner", setWinner);

        socket.current.on("endCard", () => {
            navigate("/");
        });

        // Ready to receive init state from server
        socket.current.emit("ready", roomId, (response) => {
            init(response);
        });

        return () => {
            socket.current.off("incRound", incRound);
            socket.current.off("init", init);
            socket.current.off("clearStorage", clearStorage);
            socket.current.off("winner", setWinner);
            socket.current.disconnect();
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
                        socket={socket.current}
                        roomId={roomId}
                        winner={winner}
                    />
                ))}
            </div>
            <NameTag name={fighterB} id={"B"} isWinner={winner} />
        </div>
    );
}

export default ScorePage;
