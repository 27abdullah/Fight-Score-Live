import { useState, useEffect } from "react";

export function Block({ blockRound, currRound, totalRounds, socket }) {
    const [active, setActive] = useState(false);
    const [scoreA, setScoreA] = useState("10");
    const [scoreB, setScoreB] = useState("10");
    const [changed, setChanged] = useState(false);

    function updateScore(score, setScore) {
        if (score >= 0 && score <= 10) {
            setScore(score);
        }
    }

    useEffect(() => {
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
            </div>
        )
    );
}

export default Block;
