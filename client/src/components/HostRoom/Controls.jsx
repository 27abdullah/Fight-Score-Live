import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SetWinner from "./Controls/SetWinner";
import NextFight from "./Controls/NextFight";
import NextRound from "./Controls/NextRound";
import EndCard from "./Controls/EndCard";
import Finish from "./Controls/Finish";

function Controls({ roomData, roomId, setRoomData, token, setStats }) {
    const [winner, setWinner] = useState("");
    const [outcome, setOutcome] = useState("");
    const [waitForResponse, setWaitForResponse] = useState(false);
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
            setWaitForResponse(true);
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
        } finally {
            setWaitForResponse(false);
        }
    };

    if (!token || !roomId) {
        return <h2>Loading Controls...</h2>;
    }

    return (
        <div className="flex flex-col space-y-4 p-10 bg-highlightBackground text-white rounded-lg">
            {roomData.state == FINISHED &&
            roomData.totalFights > roomData.currentFight + 1 ? (
                <NextFight handleRequest={handleRequest} />
            ) : null}
            {/* TODO add form*/}
            {/* <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                onClick={() => handleRequest("update", "POST", {})}
            >
                Update
            </button> */}
            {roomData.state == IN_PROGRESS ? (
                <NextRound
                    waitForResponse={waitForResponse}
                    roomData={roomData}
                    handleRequest={handleRequest}
                />
            ) : null}

            {roomData.state == SET_WINNER ? (
                <SetWinner
                    winner={winner}
                    setWinner={setWinner}
                    roomData={roomData}
                    handleRequest={handleRequest}
                    handleInputChange={handleInputChange}
                />
            ) : null}
            {roomData.state == IN_PROGRESS ? (
                <Finish
                    outcome={outcome}
                    winner={winner}
                    handleRequest={handleRequest}
                    handleInputChange={handleInputChange}
                    setOutcome={setOutcome}
                    roomData={roomData}
                    setWinner={setWinner}
                />
            ) : null}
            {roomData.state == FINISHED &&
            roomData.totalFights == roomData.currentFight + 1 ? (
                <EndCard handleRequest={handleRequest} />
            ) : null}
        </div>
    );
}

export default Controls;
