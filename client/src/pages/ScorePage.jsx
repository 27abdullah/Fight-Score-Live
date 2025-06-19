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
    const [winnerName, setWinnerName] = useState(""); // Winner is fighterA, fighterB, "Draw", or "". Only set when STATE == FINISHED
    const [winnerFighter, setWinnerFighter] = useState(""); // Winner is "A", "B", "Draw", or "".
    const { id: roomId } = useParams();
    const { user, token } = useUser();
    const [hostMessage, setHostMessage] = useState("");
    const [roomName, setRoomName] = useState("");
    const [currentFight, setCurrentFight] = useState(0);
    const navigate = useNavigate();
    const socket = useRef(null);
    const [scorePageState, setScorePageState] = useState([]);
    const [authReady, setAuthReady] = useState(false);
    const [state, setState] = useState(0); // IN_PROGRESS 0, FINISHED 1, SET_WINNER 2

    useEffect(() => {
        if (!user || !token || !roomId) {
            return;
        }
        setAuthReady(true);
    }, []);

    useEffect(() => {
        if (winnerFighter == "") return;
        setState(1); // Set state to FINISHED
        if (winnerFighter === "A") {
            setWinnerName(fighterA);
        } else if (winnerFighter === "B") {
            setWinnerName(fighterB);
        } else if (winnerFighter === "Draw") {
            setWinnerName("Draw");
        } else {
            console.log(winnerFighter);
            setWinnerName("OOPS");
        }
    }, [winnerFighter]);

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
            setRoomName(() => state.name);
            setCurrentFight(() => state.currentFight);
            setState(() => state.state);
            setWinnerFighter(state.winner);

            //Init state for rounds
            setScorePageState(() =>
                Array.from({ length: state.totalRounds }, (_, i) => {
                    const roundNum = i + 1;
                    const savedScoreA = sessionStorage.getItem(
                        `${roomId}/${state.currentFight}/${roundNum}/scoreA`
                    );
                    const savedScoreB = sessionStorage.getItem(
                        `${roomId}/${state.currentFight}/${roundNum}/scoreB`
                    );

                    return {
                        scoreA:
                            savedScoreA != null ? JSON.parse(savedScoreA) : 10,
                        scoreB:
                            savedScoreB != null ? JSON.parse(savedScoreB) : 10,
                        votesA: 0,
                        votesB: 0,
                        medianDiff: 0,
                    };
                })
            );
        };
        socket.current.on("init", init);

        const clearStorage = () => {
            sessionStorage.clear();
        };
        socket.current.on("clearStorage", clearStorage);

        socket.current.on("winner", setWinnerFighter);

        socket.current.on("endCard", () => {
            sessionStorage.clear();
            socket.current.disconnect();
            navigate(`/`, {
                state: {
                    flashMessage: {
                        message: `Thank you for scoring ${roomName}!`,
                        type: "success",
                    },
                },
            });
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
            socket.current.off("winner", setWinnerFighter);
            socket.current.off("endCard");
            socket.current.off("hostMessage", setHostMessage);
            socket.current.disconnect();
        };
    }, [authReady]);

    const blocks = Array.from({ length: totalRounds }, (_, i) => i + 1);

    // NOTE: This is not a typical state setter: cannot do setX(() => newValue) directly.
    // Instead use: setX(newValue).
    const updateRoundState = (index, field, value) => {
        setScorePageState((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    if (loading) {
        return <Loading />;
    }

    if (state == 1) {
        // If first mount and pullstats not run in Round component, pull stats for all rounds here
        // Assume first mount when votesA and votesB are both 0
        if (scorePageState[0].votesA === 0 && scorePageState[0].votesB === 0) {
            console.log("Pulling stats for all rounds");
            Array.from(
                { length: currentRound - 1 + 1 },
                (_, i) => 1 + i
            ).forEach((i) => {
                socket.current.emit("pullStats", i, roomId, (stats) => {
                    updateRoundState(i, "votesA", Number(stats.votesA));
                    updateRoundState(i, "votesB", Number(stats.votesB));
                    updateRoundState(i, "medianDiff", Number(stats.medianDiff));
                });
            });
        }

        return (
            <WinnerScreen
                winnerName={winnerName}
                state={scorePageState}
                currentRound={currentRound}
                fighterA={fighterA}
                fighterB={fighterB}
            />
        );
    }

    return (
        <Grid
            state={scorePageState}
            currentRound={currentRound}
            fighterA={fighterA}
            fighterB={fighterB}
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
            NameTagA={<NameTag name={fighterA} id={"A"} />}
            NameTagB={<NameTag name={fighterB} id={"B"} />}
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
                            currentFight={currentFight}
                            scoreA={scorePageState[i - 1].scoreA}
                            setScoreA={(val) =>
                                updateRoundState(i - 1, "scoreA", val)
                            }
                            scoreB={scorePageState[i - 1].scoreB}
                            setScoreB={(val) =>
                                updateRoundState(i - 1, "scoreB", val)
                            }
                            votesA={scorePageState[i - 1].votesA}
                            setVotesA={(val) =>
                                updateRoundState(i - 1, "votesA", val)
                            }
                            votesB={scorePageState[i - 1].votesB}
                            setVotesB={(val) =>
                                updateRoundState(i - 1, "votesB", val)
                            }
                            medianDiff={scorePageState[i - 1].medianDiff}
                            setMedian={(val) =>
                                updateRoundState(i - 1, "medianDiff", val)
                            }
                        />
                    ))}
                </div>
            }
        />
    );
}

export default ScorePage;
