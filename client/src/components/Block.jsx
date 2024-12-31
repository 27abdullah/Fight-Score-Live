export function Block({
    name,
    blockRound,
    currRound,
    score,
    setScore,
    setChanged,
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
                    blockRound == currRound ? "border-4 border-green-600" : ""
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
