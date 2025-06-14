import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export function CreateRoom() {
    const [numFights, setNumFights] = useState(0);
    const [roomName, setRoomName] = useState("");
    const [fights, setFights] = useState([]);
    const navigate = useNavigate();
    const { user, token } = useUser();
    const [isSending, setIsSending] = useState(false);

    const handleNumFightsChange = (e) => {
        if (e.target.value == "") {
            setNumFights(0);
            setFights([]);
            return;
        }

        const val = parseInt(e.target.value);
        if (Number.isInteger(val) && val >= 1 && val <= 20) {
            setNumFights(val);
            setFights(
                Array(val).fill({
                    totalRounds: "",
                    sport: "Boxing",
                    fighterA: "",
                    fighterB: "",
                })
            );
        }
    };

    const handleFightChange = (index, field, value) => {
        const updatedFights = [...fights];
        updatedFights[index] = { ...updatedFights[index], [field]: value };
        setFights(updatedFights);
    };

    const handleSubmit = async (e) => {
        setIsSending(true);
        e.preventDefault();
        const payload = {
            name: roomName,
            fights,
        };

        try {
            const response = await fetch(
                "http://localhost:4000/api/create-room",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error("Server error");
            }

            const data = await response.json();
            navigate(`/rooms`, {
                state: {
                    flashMessage: {
                        message: data?.message,
                        type: data?.info,
                    },
                },
            });
        } catch (error) {
            console.error("Error creating room:", error);
            navigate(`/rooms`, {
                state: {
                    flashMessage: {
                        message: "Could not create room",
                        type: "error",
                    },
                },
            });
        }
    };

    return token == null ? (
        <h1>Loading</h1>
    ) : (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-10 pt-10 pb-10">
            <div className="shadow-lg bg-highlightBackground rounded-lg p-6 w-full max-w-2xl">
                <h1 className="text-headerPurple text-3xl font-bold mb-4">
                    Create a Room
                </h1>
                <p className="text-xl">
                    Create a room to start scoring fights with your friends! The
                    last fight in the below list should correspond to the
                    headliner event.
                </p>
            </div>
            <div className="shadow-lg bg-highlightBackground rounded-lg p-6 w-full max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-lg font-medium mb-1">
                            Room Name
                        </label>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                            maxLength={25}
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-medium mb-1">
                            Number of Fights (1 - 20)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={numFights || ""}
                            onChange={handleNumFightsChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    {fights.map((fight, index) => (
                        <div
                            key={index}
                            className="border rounded p-4 mb-4 bg-highlightBackground shadow-inner"
                        >
                            <h3 className="font-semibold text-lg mb-2">
                                Fight #{index + 1}
                            </h3>

                            <label className="block text-sm mb-1">Sport</label>
                            <select
                                value={fight.sport}
                                onChange={(e) =>
                                    handleFightChange(
                                        index,
                                        "sport",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border rounded mb-2"
                            >
                                <option value="Boxing">Boxing</option>
                                <option value="MMA">MMA</option>
                                <option value="Muay Thai">Muay Thai</option>
                                <option value="Kickboxing">Kickboxing</option>
                                <option value="Wrestling">Wrestling</option>
                                <option value="BJJ">BJJ</option>
                                <option value="Karate">Karate</option>
                                <option value="Taekwondo">Taekwondo</option>
                                <option value="Judo">Judo</option>
                                <option value="Sambo">Sambo</option>
                            </select>

                            <label className="block text-sm mb-1">
                                Total Rounds
                            </label>
                            <input
                                type="number"
                                value={fight.totalRounds}
                                min="1"
                                max="15"
                                onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    if (Number.isInteger(val) && val > 0) {
                                        handleFightChange(
                                            index,
                                            "totalRounds",
                                            parseInt(e.target.value)
                                        );
                                    } else {
                                        handleFightChange(
                                            index,
                                            "totalRounds",
                                            ""
                                        );
                                    }
                                }}
                                className="w-full p-2 border rounded mb-2"
                                required
                            />

                            <label className="block text-sm mb-1">
                                Fighter A
                            </label>
                            <input
                                type="text"
                                value={fight.fighterA}
                                onChange={(e) =>
                                    handleFightChange(
                                        index,
                                        "fighterA",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border rounded mb-2"
                                required
                                maxLength={30}
                            />

                            <label className="block text-sm mb-1">
                                Fighter B
                            </label>
                            <input
                                type="text"
                                value={fight.fighterB}
                                onChange={(e) =>
                                    handleFightChange(
                                        index,
                                        "fighterB",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border rounded"
                                required
                                maxLength={30}
                            />
                        </div>
                    ))}

                    <button
                        disabled={isSending}
                        type="submit"
                        className={`${
                            isSending
                                ? "bg-gray-600"
                                : "bg-purple-600 hover:bg-purple-700"
                        } text-white font-semibold py-2 px-4 rounded`}
                    >
                        Submit Room
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateRoom;
