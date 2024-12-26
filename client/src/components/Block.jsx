import { useState, useEffect } from "react";

export function Block({ id, round, totalRounds, setStatsA, setStatsB }) {
    const [active, setActive] = useState(false);
    const [scoreA, setScoreA] = useState(10);
    const [scoreB, setScoreB] = useState(10);

    function updateScore(score, setScore) {
        if (score >= 0 && score <= 10) {
            setScore(score);
        }
    }

    function sendScore() {
        fetch("/api/score", {
            method: "POST",
            body: JSON.stringify({
                round: round - 1,
                scoreA: scoreA,
                scoreB: scoreB,
            }),
            headers: {
                "Content-type": "application/json",
            },
        });
    }

    async function fetchStats() {
        const res = await fetch(`/api/stats/${round - 1}`, {
            method: "GET",
        });

        const data = await res.json();
        console.log(data);
        // setStatsA(data.statsA);
        // setStatsB(data.statsB);
    }

    useEffect(() => {
        setActive(round >= id);

        // Round i is submitted when round i + 1 is active.
        if (round === id + 1 && round <= totalRounds + 1) {
            sendScore();
            setTimeout(() => {
                fetchStats();
            }, 2000); // 2 seconds delay
        }
    }, [round]);

    return (
        active && (
            <div>
                <div
                    className={`m-7 ${
                        id == round ? "border-4 border-green-600" : ""
                    }`}
                >
                    <input
                        name="scoreA"
                        type="number"
                        className="w-32 h-32 text-black text-center text-2xl"
                        value={scoreA}
                        readOnly={id < round}
                        onChange={(e) =>
                            updateScore(Number(e.target.value), setScoreA)
                        }
                    />
                </div>
                <div
                    className={`m-7 ${
                        id == round ? "border-4 border-green-600" : ""
                    }`}
                >
                    <input
                        name="scoreB"
                        type="number"
                        className="w-32 h-32 text-black text-center text-2xl"
                        value={scoreB}
                        readOnly={id < round}
                        onChange={(e) =>
                            updateScore(Number(e.target.value), setScoreB)
                        }
                    />
                </div>
            </div>
        )
    );
}
