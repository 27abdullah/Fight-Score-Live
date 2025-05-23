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
}) {
    const [active, setActive] = useState(false);
    const [scoreA, setScoreA] = useState(() => {
        const savedScoreA = sessionStorage.getItem(
            `${roomId}/${blockRound}/scoreA`
        );
        return savedScoreA != null ? JSON.parse(savedScoreA) : 10;
    });
    const [scoreB, setScoreB] = useState(() => {
        const savedScoreB = sessionStorage.getItem(
            `${roomId}/${blockRound}/scoreB`
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
                `${roomId}/${blockRound}/scoreA`,
                JSON.stringify(scoreA)
            );
            sessionStorage.setItem(
                `${roomId}/${blockRound}/scoreB`,
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

        socket.on(`stats/${blockRound}`, handleStats);

        if (currentRound > blockRound) {
            // Get individual score
            const savedScoreA = sessionStorage.getItem(
                `${roomId}/${blockRound}/scoreA`
            );
            if (savedScoreA != null && savedScoreA >= 0 && savedScoreA <= 10) {
                setScoreA(savedScoreA);
            } else {
                setScoreA("");
            }
            const savedScoreB = sessionStorage.getItem(
                `${roomId}/${blockRound}/scoreB`
            );
            if (savedScoreB != null && savedScoreB >= 0 && savedScoreB <= 10) {
                setScoreB(savedScoreB);
            } else {
                setScoreB("");
            }

            // Get aggregate stats
            socket.emit("pullStats", blockRound, roomId, (response) => {
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
        socket.on("init", reset);

        return () => {
            socket.off(`stats/${blockRound}`, handleStats);
            socket.off("init", reset);
        };
    }, []);

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
            socket.emit("roundResults", roomId, {
                round: currentRound - 1,
                scoreA: scoreA,
                scoreB: scoreB,
            });
        }
        setChanged(() => false);
    }, [currentRound]);

    return (
        active && (
            <div>
                <BarGraph votesA={votesA} votesB={votesB} direction={true} />
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
                <BarGraph votesA={votesA} votesB={votesB} direction={false} />
            </div>
        )
    );
}

export default Round;
