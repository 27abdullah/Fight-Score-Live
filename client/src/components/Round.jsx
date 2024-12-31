import { useState, useEffect } from "react";
import Block from "./Block";
import BarGraph from "./BarGraph";

export function Round({ blockRound, currRound, totalRounds, socket }) {
    const [active, setActive] = useState(false);
    const [scoreA, setScoreA] = useState("10");
    const [scoreB, setScoreB] = useState("10");
    const [changed, setChanged] = useState(false);
    const [statsA, setStatsA] = useState(0);
    const [statsB, setStatsB] = useState(0);

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
            socket.emit("pullStats", blockRound, (response) => {
                console.log("pullstats");
                console.log(response);
                setStatsA(() => Number(response.statsA));
                setStatsB(() => Number(response.statsB));
            });
        }

        return () => {
            socket.off(`stats/${blockRound}`, handleStats);
        };
    }, []);

    useEffect(() => {
        console.log("current round: " + currRound);
        setActive(currRound >= blockRound);
        // Round i is submitted when round i + 1 is active.
        if (
            changed &&
            currRound === blockRound + 1 &&
            currRound <= totalRounds + 1
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
                />
                <Block
                    name="scoreB"
                    blockRound={blockRound}
                    currRound={currRound}
                    score={scoreB}
                    setScore={setScoreB}
                    setChanged={setChanged}
                />
                <BarGraph statsA={statsA} statsB={statsB} direction={false} />
            </div>
        )
    );
}

export default Round;
