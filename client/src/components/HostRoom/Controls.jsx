import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Controls({ roomData, roomId, setRoomData, token, setStats }) {
    const [winner, setWinner] = useState("");
    const [outcome, setOutcome] = useState("");
    const IN_PROGRESS = 0;
    const FINISHED = 1;
    const SET_WINNER = 2;
    const navigate = useNavigate();

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const handleRequest = async (endpoint, method, body) => {
        body.id = roomId;
        try {
            const response = await fetch(
                `http://localhost:4000/api/${endpoint}`,
                {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(body),
                }
            );
            const data = await response.json(); //  roomData, stats, failMessage, end

            if (data.end) {
                navigate(`/rooms`, {
                    state: {
                        flashMessage: {
                            message: `Thank you for hosting ${roomData.name}!`,
                            type: "success",
                        },
                    },
                });
            }

            if (data.failMessage) {
                return;
            }
            if (data.stats) {
                setStats(() => {
                    return { ...data.stats };
                });
            }
            if (data.roomData) {
                setRoomData(() => {
                    return { ...data.roomData };
                });

                setOutcome("");
                setWinner("");
            }
        } catch (error) {
            console.error(`Error with ${endpoint}:`, error);
        }
    };

    if (!token || !roomId) {
        return <h2>Loading Controls...</h2>;
    }

    return (
        <div className="flex flex-col space-y-4 p-10 bg-highlightBackground text-white rounded-lg">
            {roomData.state == FINISHED &&
            roomData.totalFights > roomData.currentFight + 1 ? (
                <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                    onClick={() => handleRequest("next", "POST", {})}
                >
                    Next Fight
                </button>
            ) : null}
            {/* TODO add form*/}
            {/* <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => handleRequest("update", "POST", {})}
            >
                Update
            </button> */}
            {roomData.state == IN_PROGRESS ? (
                <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                    onClick={() => handleRequest("round", "POST", {})}
                >
                    {roomData.currentRound == roomData.totalRounds
                        ? "To Decision"
                        : "Next Round"}
                </button>
            ) : null}

            {roomData.state == SET_WINNER ? (
                <>
                    <button
                        disabled={!winner}
                        className={`px-4 py-2 rounded ${
                            winner
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() =>
                            handleRequest("set-winner", "POST", { winner })
                        }
                    >
                        Set Winner
                    </button>
                    <select
                        className="p-2 rounded bg-gray-700 mb-2"
                        value={winner}
                        onChange={handleInputChange(setWinner)}
                    >
                        <option value="" disabled>
                            Select Winner
                        </option>
                        <option value="A">{roomData.fighterA}</option>
                        <option value="B">{roomData.fighterB}</option>
                    </select>
                </>
            ) : null}
            {roomData.state == IN_PROGRESS ? (
                <>
                    <button
                        className={`px-4 py-2 rounded ${
                            outcome && winner
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() =>
                            handleRequest("finish", "POST", { outcome, winner })
                        }
                        disabled={!outcome || !winner}
                    >
                        Finish (K.O., etc.)
                    </button>

                    <input
                        required
                        className="p-2 rounded bg-gray-700 mb-2"
                        placeholder="Outcome"
                        value={outcome}
                        onChange={handleInputChange(setOutcome)}
                    />
                    <select
                        required
                        className="p-2 rounded bg-gray-700 mb-2"
                        value={winner}
                        onChange={handleInputChange(setWinner)}
                    >
                        <option value="" disabled>
                            Select Winner
                        </option>
                        <option value="A">{roomData.fighterA}</option>
                        <option value="B">{roomData.fighterB}</option>
                    </select>
                </>
            ) : null}
            {roomData.state == FINISHED &&
            roomData.totalFights == roomData.currentFight + 1 ? (
                <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                    onClick={() => handleRequest("end-card", "POST", {})}
                >
                    End Card
                </button>
            ) : null}
        </div>
    );
}

export default Controls;
