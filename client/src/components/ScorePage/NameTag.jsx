export function NameTag({ name, id, isWinner }) {
    const winnerClass = isWinner === id ? "text-green-500" : "";
    const shadow =
        id === "A"
            ? `drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]`
            : `drop-shadow-[0_0_10px_rgba(0,0,255,0.5)]`;
    return (
        <div className="flex items-center justify-center w-full h-full">
            <h1
                className={`text-2xl sm:text-3xl md:text-3xl  ${shadow} ${winnerClass}`}
            >
                {name}
            </h1>
        </div>
    );
}

export default NameTag;
