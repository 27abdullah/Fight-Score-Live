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
        <div className="min-w-full min-h-full mx-auto p-10 bg-dune rounded-3xl select-non shadow-lg text-white">
            <div className="italic text-lg sm:text-xl font-industry_demi mb-1">
                Winner
            </div>
            <div className="text-xl text-center md:text-2xl truncate mb-4 text-white bg-gradient-to-r p-5 rounded-lg to-rich_carmine from-red-800">
                {winnerName}
            </div>
            <div className="text-sm sm:text-base space-y-1 leading-relaxed e">
                <div>{`${fighterA} 📈 ${totalAVotes} votes`}</div>
                <div>{`${fighterB} 📈 ${totalBVotes} votes`}</div>
                <div className="mt-2 font-semibold text-indigo-300">{`${up} was up ${Math.abs(
                    totalMedianDiff
                )} points!`}</div>
            </div>
        </div>
    );
}
