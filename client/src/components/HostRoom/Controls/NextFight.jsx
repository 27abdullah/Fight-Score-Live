export default function NextFight({ handleRequest }) {
    return (
        <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            onClick={() => handleRequest("next", "POST", {})}
        >
            Next Fight
        </button>
    );
}
