export default function WinnerStats({
    winnerName,
    state,
    currentRound,
    fighterA,
    fighterB,
}) {
    const totalAVotes = state
        .slice(0, currentRound)
        .reduce((acc, round) => acc + round.votesA, 0);

    const totalBVotes = state
        .slice(0, currentRound)
        .reduce((acc, round) => acc + round.votesB, 0);
    const totalMedianDiff = state
        .slice(0, currentRound)
        .reduce((acc, round) => acc + round.medianDiff, 0);
    const up = totalMedianDiff > 0 ? fighterA : fighterB;

    return (
        <div className="text-lg sm:text-2xl truncate">
            <div className="italic text-xl">Winner</div>
            <div className="text-3xl">{winnerName}</div>
            <div className="text-sm">
                <br />
                {`${fighterA} Votes: ${totalAVotes}`}
                <br />
                {`${fighterB} Votes: ${totalBVotes}`}
                <br />
                {`${up} is up ${Math.abs(totalMedianDiff)} points!`}
            </div>
        </div>
    );
}
