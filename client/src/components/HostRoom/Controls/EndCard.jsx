export default function EndCard({ handleRequest }) {
    return (
        <button
            className="px-4 py-2 bg-rich_carmine hover:bg-red-900 rounded"
            onClick={() => handleRequest("end-card", "POST", {})}
        >
            End Card
        </button>
    );
}
