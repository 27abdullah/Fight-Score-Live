export default function Finish({
    outcome,
    winner,
    handleRequest,
    handleInputChange,
    setOutcome,
    roomData,
    setWinner,
}) {
    return (
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

            <select
                required
                className="p-2 rounded bg-gray-700 mb-2"
                value={outcome}
                onChange={handleInputChange(setOutcome)}
            >
                <option value="" disabled>
                    Select Outcome
                </option>
                <option value="Knockout">Knockout</option>
                <option value="TKO">TKO</option>
                <option value="DQ">DQ</option>
                <option value="Submission">Submission</option>
                <option value="No Contest">No Contest</option>
            </select>
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
                <option value="Draw">Draw</option>
            </select>
        </>
    );
}
