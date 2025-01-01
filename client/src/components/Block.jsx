export function Block({
    name,
    blockRound,
    currRound,
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
                className={`m-7 ${
                    blockRound == currRound
                        ? changed
                            ? "border-4 border-green-500"
                            : "border-4 border-orange-500"
                        : ""
                }`}
            >
                <input
                    name={name}
                    type="number"
                    className="w-32 h-32 text-white text-center text-2xl"
                    value={score}
                    readOnly={blockRound < currRound}
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
