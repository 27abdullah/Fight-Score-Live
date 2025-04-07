export function NameTag({ name, id, isWinner }) {
    const winnerClass = isWinner === id ? "text-green-500" : "";
    return <h1 className={`text-3xl ${winnerClass}`}>{`${id}: ${name}`}</h1>;
}

export default NameTag;
