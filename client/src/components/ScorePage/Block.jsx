export function Block({
    name,
    blockRound,
    currentRound,
    score,
    setScore,
    setChanged,
    changed,
    winner,
}) {
    function updateScore(score, setScore) {
        if (score >= 0 && score <= 10) {
            setScore(score);
        }
    }

    return (
        <>
            <div
                className={`m-7 ${
                    blockRound == currentRound && winner === ""
                        ? changed
                            ? "border-4 border-green-500"
                            : "border-4 border-orange-500"
                        : ""
                }`}
            >
                <input
                    name={name}
                    type="number"
                    className="w-28 h-28 text-white text-center text-2xl"
                    value={score}
                    readOnly={blockRound < currentRound}
                    onChange={(e) => {
                        updateScore(Number(e.target.value), setScore);
                        setChanged(() => true);
                    }}
                />
            </div>
        </>
    );
}

export default Block;
