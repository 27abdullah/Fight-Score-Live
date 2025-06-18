export function Block({
    name,
    blockRound,
    currentRound,
    score,
    setScore,
    setChanged,
    changed,
}) {
    function updateScore(score, setScore) {
        if (score >= 0 && score <= 10) {
            setScore(score);
        }
    }

    return (
        <>
            <div
                className={`mx-5 ${
                    blockRound == currentRound
                        ? changed
                            ? "border-4 border-green-500"
                            : "border-4 border-orange-500"
                        : ""
                }`}
            >
                <input
                    name={name}
                    type="number"
                    className="w-20 sm:w-20 md:w-24 h-20 sm:h-20 md:h-24 text-white text-center text-l sm:text-xl md:text-2xl " //TODO
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
