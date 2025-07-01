export default function StatsTab({
    fighterA,
    fighterB,
    totalAVotes,
    totalBVotes,
    up,
    totalMedianDiff,
}) {
    return (
        <>
            {`${fighterA} 📈 ${totalAVotes} votes`}
            <br />
            {`${fighterB} 📈 ${totalBVotes} votes`}
            <br />
            {totalMedianDiff != 0 &&
                `${up} is up ${Math.abs(totalMedianDiff)} points!`}{" "}
        </>
    );
}
