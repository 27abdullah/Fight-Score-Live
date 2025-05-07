import { useState } from "react";

function Controls({ roomData, roomId, setRoomData, token }) {
    const [id, setId] = useState("");
    const [winner, setWinner] = useState("");
    const [outcome, setOutcome] = useState("");
    const IN_PROGRESS = 0;
    const FINISHED = 1;
    const SET_WINNER = 2;

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
            const data = await response.json();
            console.log(endpoint, data);
        } catch (error) {
            console.error(`Error with ${endpoint}:`, error);
        }
    };

    if (!token || !roomId) {
        return <h2>Loading Controls...</h2>;
    }

    return (
        <div className="flex flex-col space-y-4 p-10 bg-highlightBackground text-white rounded-lg">
            {roomData.state == FINISHED ? (
                <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                    onClick={() => handleRequest("next", "POST", {})}
                >
                    Next Fight
                </button>
            ) : (
                <></>
            )}

            <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => handleRequest("update", "POST", {})}
            >
                Update
            </button>

            <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => handleRequest("round", "POST", {})}
            >
                Next Round
            </button>

            {roomData.state == SET_WINNER ? (
                <>
                    <input
                        className="p-2 rounded bg-gray-700 mb-2"
                        placeholder="Winner (A/B)"
                        value={winner}
                        onChange={handleInputChange(setWinner)}
                    />
                    <button
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                        onClick={() =>
                            handleRequest("set-winner", "POST", { winner })
                        }
                    >
                        Set Winner
                    </button>
                </>
            ) : (
                <></>
            )}

            <input
                className="p-2 rounded bg-gray-700 mb-2"
                placeholder="Outcome"
                value={outcome}
                onChange={handleInputChange(setOutcome)}
            />
            <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() =>
                    handleRequest("finish", "POST", { outcome, winner })
                }
            >
                Finish (K.O., etc.)
            </button>

            {roomData.state == FINISHED &&
            roomData.totalFights == roomData.currentFight + 1 ? (
                <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                    onClick={() => handleRequest("end-card", "POST", {})}
                >
                    End Card
                </button>
            ) : (
                <></>
            )}
        </div>
    );
}

export default Controls;
