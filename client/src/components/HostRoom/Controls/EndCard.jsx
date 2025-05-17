export default function EndCard({ handleRequest }) {
    return (
        <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            onClick={() => handleRequest("end-card", "POST", {})}
        >
            End Card
        </button>
    );
}
