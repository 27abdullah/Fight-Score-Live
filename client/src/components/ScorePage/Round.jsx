import { useState, useEffect } from "react";
import Block from "./Block";
import BarGraph from "./BarGraph";

export function Round({
    blockRound,
    currentRound,
    totalRounds,
    socket,
    roomId,
    winner,
    currentFight,
}) {
    const [active, setActive] = useState(false);
    const [scoreA, setScoreA] = useState(() => {
        const savedScoreA = sessionStorage.getItem(
            `${roomId}/${currentFight}/${blockRound}/scoreA`
        );
        return savedScoreA != null ? JSON.parse(savedScoreA) : 10;
    });
    const [scoreB, setScoreB] = useState(() => {
        const savedScoreB = sessionStorage.getItem(
            `${roomId}/${currentFight}/${blockRound}/scoreB`
        );
        return savedScoreB != null ? JSON.parse(savedScoreB) : 10;
    });
    const [changed, setChanged] = useState(false);
    const [votesA, setVotesA] = useState(0);
    const [votesB, setVotesB] = useState(0);
    const [median, setMedian] = useState(0);

    useEffect(() => {
        if (currentRound >= blockRound && changed) {
            sessionStorage.setItem(
                `${roomId}/${currentFight}/${blockRound}/scoreA`,
                JSON.stringify(scoreA)
            );
            sessionStorage.setItem(
                `${roomId}/${currentFight}/${blockRound}/scoreB`,
                JSON.stringify(scoreB)
            );
        }
    }, [scoreA, scoreB, changed]);

    useEffect(() => {
        function handleStats(stats) {
            setVotesA(() => Number(stats.votesA));
            setVotesB(() => Number(stats.votesB));
            setMedian(() => Number(stats.medianDiff));
        }

        socket.current.on(`stats/${blockRound}`, handleStats);

        if (currentRound > blockRound) {
            // Get individual score
            const savedScoreA = sessionStorage.getItem(
                `${roomId}/${currentFight}/${blockRound}/scoreA`
            );
            if (savedScoreA != null && savedScoreA >= 0 && savedScoreA <= 10) {
                setScoreA(savedScoreA);
            } else {
                setScoreA("");
            }
            const savedScoreB = sessionStorage.getItem(
                `${roomId}/${currentFight}/${blockRound}/scoreB`
            );
            if (savedScoreB != null && savedScoreB >= 0 && savedScoreB <= 10) {
                setScoreB(savedScoreB);
            } else {
                setScoreB("");
            }

            // Get aggregate stats
            socket.current.emit("pullStats", blockRound, roomId, (response) => {
                setVotesA(() => Number(response.votesA));
                setVotesB(() => Number(response.votesB));
                // Median diff also available
            });
        }

        const reset = () => {
            setScoreA(10);
            setScoreB(10);
            setVotesA(0);
            setVotesB(0);
            setChanged(false);
        };
        socket.current.on("init", reset);

        return () => {
            socket.current.off(`stats/${blockRound}`, handleStats);
            socket.current.off("init", reset);
        };
    }, [currentRound]);

    useEffect(() => {
        setActive(currentRound >= blockRound);
        // Round i is submitted when round i + 1 is active.
        if (
            changed &&
            currentRound === blockRound + 1 &&
            currentRound <= totalRounds + 1 &&
            0 <= scoreA <= 10 &&
            0 <= scoreB <= 10
        ) {
            socket.current.emit("roundResults", roomId, {
                round: currentRound - 1,
                scoreA: scoreA,
                scoreB: scoreB,
            });
        }
        setChanged(() => false);
    }, [currentRound]);

    return (
        active && (
            <div className="border grid grid-rows-[1fr_auto_1fr] items-center mx-3 sm:mx-6">
                <div className="border flex justify-center h-full items-end">
                    <BarGraph
                        votesA={votesA}
                        votesB={votesB}
                        direction={true}
                    />
                </div>
                <div className="border flex flex-col items-center">
                    <Block
                        name="scoreA"
                        blockRound={blockRound}
                        currentRound={currentRound}
                        score={scoreA}
                        setScore={setScoreA}
                        setChanged={setChanged}
                        changed={changed}
                        winner={winner}
                    />
                    <Block
                        name="scoreB"
                        blockRound={blockRound}
                        currentRound={currentRound}
                        score={scoreB}
                        setScore={setScoreB}
                        setChanged={setChanged}
                        changed={changed}
                        winner={winner}
                    />
                </div>
                <div className="border flex justify-center h-full items-start">
                    <BarGraph
                        votesA={votesA}
                        votesB={votesB}
                        direction={false}
                    />
                </div>
            </div>
        )
    );
}

export default Round;
