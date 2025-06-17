import { useState, useEffect } from "react";
import Block from "./Block";
import BarGraph from "./BarGraph";
import RoundNumber from "./RoundNumber";

export function Round({
    blockRound,
    currentRound,
    totalRounds,
    socket,
    roomId,
    winner,
    currentFight,
    scoreA,
    setScoreA,
    scoreB,
    setScoreB,
    votesA,
    setVotesA,
    votesB,
    setVotesB,
    medianDiff,
    setMedian,
}) {
    const [active, setActive] = useState(false);
    const [changed, setChanged] = useState(false);

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
            setVotesA(Number(stats.votesA));
            setVotesB(Number(stats.votesB));
            setMedian(Number(stats.medianDiff));
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
            socket.current.emit("pullStats", blockRound, roomId, (stats) => {
                handleStats(stats);
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
            <div className=" grid grid-rows-[1fr_auto_1fr] items-center mx-2 md:mx-6">
                <div className=" flex justify-center h-full items-end">
                    <BarGraph
                        votesA={votesA}
                        votesB={votesB}
                        medianDiff={medianDiff}
                        direction={true}
                    />
                </div>
                <div className=" flex flex-col items-center">
                    <Block
                        name="scoreA"
                        blockRound={blockRound}
                        currentRound={currentRound}
                        score={scoreA}
                        setScore={setScoreA}
                        setChanged={setChanged}
                        changed={changed}
                        winner={winner}
                        direction={true}
                    />
                    <RoundNumber blockRound={blockRound} />
                    <Block
                        name="scoreB"
                        blockRound={blockRound}
                        currentRound={currentRound}
                        score={scoreB}
                        setScore={setScoreB}
                        setChanged={setChanged}
                        changed={changed}
                        winner={winner}
                        direction={false}
                    />
                </div>
                <div className=" flex justify-center h-full items-start">
                    <BarGraph
                        votesA={votesA}
                        votesB={votesB}
                        medianDiff={medianDiff}
                        direction={false}
                    />
                </div>
            </div>
        )
    );
}

export default Round;
