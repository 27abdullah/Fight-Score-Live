export function NameTag({ name, id, isWinner }) {
    const winnerClass = isWinner === id ? "text-green-500" : "";
    return (
        <div className="flex items-center justify-center w-full h-full">
            <h1 className={`text-2xl ${winnerClass}`}>{name}</h1>
        </div>
    );
}

export default NameTag;
