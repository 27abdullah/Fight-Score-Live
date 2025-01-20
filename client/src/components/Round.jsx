import { useState, useEffect } from "react";
import Block from "./Block";
import BarGraph from "./BarGraph";

export function Round({ blockRound, currRound, totalRounds, socket }) {
    const [active, setActive] = useState(false);
    const [scoreA, setScoreA] = useState(() => {
        const savedScoreA = sessionStorage.getItem(`${blockRound}/scoreA`);
        return savedScoreA != null ? JSON.parse(savedScoreA) : 10;
    });
    const [scoreB, setScoreB] = useState(() => {
        const savedScoreB = sessionStorage.getItem(`${blockRound}/scoreB`);
        return savedScoreB != null ? JSON.parse(savedScoreB) : 10;
    });
    const [changed, setChanged] = useState(false);
    const [statsA, setStatsA] = useState(0);
    const [statsB, setStatsB] = useState(0);

    useEffect(() => {
        if (currRound >= blockRound && changed) {
            sessionStorage.setItem(
                `${blockRound}/scoreA`,
                JSON.stringify(scoreA)
            );
            sessionStorage.setItem(
                `${blockRound}/scoreB`,
                JSON.stringify(scoreB)
            );
        }
    }, [scoreA, scoreB, changed]);

    useEffect(() => {
        console.log("use effect first mount");
        function handleStats(stats) {
            console.log("handlestats");
            console.log(stats);
            setStatsA(() => Number(stats.statsA));
            setStatsB(() => Number(stats.statsB));
        }

        socket.on(`stats/${blockRound}`, handleStats);

        if (currRound > blockRound) {
            // Get individual score
            const savedScoreA = sessionStorage.getItem(`${blockRound}/scoreA`);
            if (savedScoreA != null && savedScoreA >= 0 && savedScoreA <= 10) {
                setScoreA(savedScoreA);
            } else {
                setScoreA("");
            }
            const savedScoreB = sessionStorage.getItem(`${blockRound}/scoreB`);
            if (savedScoreB != null && savedScoreB >= 0 && savedScoreB <= 10) {
                setScoreB(savedScoreB);
            } else {
                setScoreB("");
            }

            // Get aggregate stats
            socket.emit("pullStats", blockRound, (response) => {
                console.log("pullstats");
                console.log(response);
                setStatsA(() => Number(response.statsA));
                setStatsB(() => Number(response.statsB));
            });
        }

        const reset = () => {
            setScoreA(10);
            setScoreB(10);
            setStatsA(0);
            setStatsB(0);
            setChanged(false);
        };
        socket.on("init", reset);

        return () => {
            socket.off(`stats/${blockRound}`, handleStats);
            socket.off("init", reset);
        };
    }, []);

    useEffect(() => {
        setActive(currRound >= blockRound);
        // Round i is submitted when round i + 1 is active.
        if (
            changed &&
            currRound === blockRound + 1 &&
            currRound <= totalRounds + 1 &&
            0 <= scoreA <= 10 &&
            0 <= scoreB <= 10
        ) {
            socket.emit("roundResults", {
                round: currRound - 1,
                scoreA: scoreA,
                scoreB: scoreB,
            });
        }
        setChanged(() => false);
    }, [currRound]);

    return (
        active && (
            <div>
                <BarGraph statsA={statsA} statsB={statsB} direction={true} />
                <Block
                    name="scoreA"
                    blockRound={blockRound}
                    currRound={currRound}
                    score={scoreA}
                    setScore={setScoreA}
                    setChanged={setChanged}
                    changed={changed}
                />
                <Block
                    name="scoreB"
                    blockRound={blockRound}
                    currRound={currRound}
                    score={scoreB}
                    setScore={setScoreB}
                    setChanged={setChanged}
                    changed={changed}
                />
                <BarGraph statsA={statsA} statsB={statsB} direction={false} />
            </div>
        )
    );
}

export default Round;
