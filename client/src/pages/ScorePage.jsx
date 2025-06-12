import { useState, useEffect, useRef } from "react";
import Round from "../components/ScorePage/Round";
import { useParams } from "react-router-dom";
import NameTag from "../components/ScorePage/NameTag";
import Grid from "../components/ScorePage/Grid";
import Loading from "../components/ScorePage/Loading";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ScrollingBanner from "../components/ScorePage/ScrollingBanner";
import WinnerScreen from "../components/ScorePage/WinnerScreen";

export function ScorePage() {
    const [totalRounds, setTotalRounds] = useState(5);
    const [currentRound, setcurrentRound] = useState(1);
    const [loading, setLoading] = useState(true);
    const [fighterA, setFighterA] = useState("");
    const [fighterB, setFighterB] = useState("");
    const [winner, setWinner] = useState(""); // Winner is "A", "B", "Draw", or "". Only set when STATE == FINISHED
    const { id: roomId } = useParams();
    const { user, token } = useUser();
    const [hostMessage, setHostMessage] = useState("");
    const [roomName, setRoomName] = useState("");
    const [currentFight, setCurrentFight] = useState(0);
    const navigate = useNavigate();
    const socket = useRef(null);

    useEffect(() => {
        if (!user || !token || !roomId) {
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
            setRoomName(() => state.name);
            setCurrentFight(() => state.currentFight);
        };
        socket.current.on("init", init);

        const clearStorage = () => {
            sessionStorage.clear();
        };
        socket.current.on("clearStorage", clearStorage);

        socket.current.on("winner", setWinner);

        socket.current.on("endCard", () => {
            sessionStorage.clear();
            socket.current.disconnect();
            navigate("/");
        });

        socket.current.on("hostMessage", (message) => {
            setHostMessage(message);
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
            socket.current.off("endCard");
            socket.current.off("hostMessage", setHostMessage);
            socket.current.disconnect();
        };
    }, [user, roomId, token]);

    const blocks = Array.from({ length: totalRounds }, (_, i) => i + 1);

    if (loading) {
        return <Loading />;
    }

    if (winner != "") {
        return <WinnerScreen winner={winner} />;
    }

    return (
        <Grid
            Banner={
                <ScrollingBanner
                    items={
                        hostMessage != ""
                            ? [
                                  `You are scoring ${roomName}`,
                                  "|",
                                  `${hostMessage}`,
                                  "|",
                                  currentRound > totalRounds
                                      ? "Fight Over"
                                      : "Round: " + currentRound,
                                  "|",
                              ]
                            : [
                                  `You are scoring ${roomName}`,
                                  "|",
                                  currentRound > totalRounds
                                      ? "Fight Over"
                                      : "Round: " + currentRound,
                                  "|",
                              ]
                    }
                />
            }
            NameTagA={<NameTag name={fighterA} id={"A"} isWinner={winner} />}
            NameTagB={<NameTag name={fighterB} id={"B"} isWinner={winner} />}
            Rounds={
                <div className="flex items-center justify-center h-[75vh]">
                    {blocks.map((i) => (
                        <Round
                            key={i}
                            blockRound={i}
                            currentRound={currentRound}
                            totalRounds={totalRounds}
                            socket={socket}
                            roomId={roomId}
                            winner={winner}
                            currentFight={currentFight}
                        />
                    ))}
                </div>
            }
        />
    );
}

export default ScorePage;
