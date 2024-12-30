import { useState, useEffect } from "react";

export function BlockPair({ blockRound, currRound, totalRounds, socket }) {
    const [active, setActive] = useState(false);
    const [scoreA, setScoreA] = useState("10");
    const [scoreB, setScoreB] = useState("10");
    const [changed, setChanged] = useState(false);
    const [statsA, setStatsA] = useState(0);
    const [statsB, setStatsB] = useState(0);

    function updateScore(score, setScore) {
        if (score >= 0 && score <= 10) {
            setScore(score);
        }
    }

    /**
     * Give percentage on 0 - 1 scale.
     * isUp bool for direction
     */
    function renderBarGraph(stats, isUp) {
        console.log(statsA, statsB);
        return statsA + statsB == 0 ? (
            <div></div>
        ) : (
            <div
                className={"bg-blue-500 w-32 mx-7"}
                style={{
                    height: 100 * (stats / (statsA + statsB)),
                }}
            ></div>
        );
    }

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
                <div>{statsA > 0 && renderBarGraph(statsA, true)}</div>
                <div
                    className={`m-7 ${
                        blockRound == currRound
                            ? "border-4 border-green-600"
                            : ""
                    }`}
                >
                    <input
                        name="scoreA"
                        type="number"
                        className="w-32 h-32 text-white text-center text-2xl"
                        value={scoreA}
                        readOnly={blockRound < currRound}
                        onChange={(e) => {
                            updateScore(Number(e.target.value), setScoreA);
                            setChanged(() => true);
                        }}
                    />
                </div>
                <div
                    className={`m-7 ${
                        blockRound == currRound
                            ? "border-4 border-green-600"
                            : ""
                    }`}
                >
                    <input
                        name="scoreB"
                        type="number"
                        className="w-32 h-32 text-white text-center text-2xl"
                        value={scoreB}
                        readOnly={blockRound < currRound}
                        onChange={(e) => {
                            updateScore(Number(e.target.value), setScoreB);
                            setChanged(() => true);
                        }}
                    />
                </div>
                <div>{statsB > 0 && renderBarGraph(statsB, false)}</div>
            </div>
        )
    );
}

export default BlockPair;
