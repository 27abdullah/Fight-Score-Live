export default function SetWinner({
    winner,
    setWinner,
    roomData,
    handleRequest,
    handleInputChange,
}) {
    return (
        <>
            <button
                disabled={!winner}
                className={`px-4 py-2 rounded ${
                    winner
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-500 cursor-not-allowed"
                }`}
                onClick={() => handleRequest("set-winner", "POST", { winner })}
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
    );
}
