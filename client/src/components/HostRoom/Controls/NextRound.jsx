export default function NextRound({
    waitForResponse,
    roomData,
    handleRequest,
}) {
    return (
        <button
            disabled={waitForResponse}
            className={`px-4 py-2 rounded ${
                waitForResponse
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={() => handleRequest("round", "POST", {})}
        >
            {roomData.currentRound == roomData.totalRounds
                ? "To Decision"
                : "Next Round"}
        </button>
    );
}
