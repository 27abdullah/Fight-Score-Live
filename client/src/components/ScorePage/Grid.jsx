export default function Grid({
    Banner,
    NameTagA,
    NameTagB,
    Rounds,
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
        <div className="flex flex-col h-screen w-screen overflow-hidden">
            {/* Top: Banner and NameTagA */}
            <div className="flex flex-col gap-2 pt-2 pb-2">
                <div className="rounded overflow-hidden">{Banner}</div>
                <div className="rounded overflow-hidden">{NameTagA}</div>
            </div>

            {/* Main content with Rounds + Sidebar */}
            <div className="flex-grow min-h-0 min-w-0 pt-2 pb-2 flex flex-col md:grid md:grid-cols-[2fr_1fr] gap-2">
                {/* Scrollable Rounds Section */}
                <div className="rounded bg-slate-600 overflow-hidden min-h-0 min-w-0 flex flex-col">
                    {/* Mobile-only sidebar below Rounds */}
                    <div className="md:hidden p-4 bg-purple-900 rounded h-[25%]">
                        <br />
                        {`A Votes: ${totalAVotes}`}
                        <br />
                        {`B Votes: ${totalBVotes}`}
                        <br />
                        {`${up} is up ${Math.abs(totalMedianDiff)} points!`}
                    </div>

                    {/* Rounds */}
                    <div className="flex flex-1 overflow-x-auto overflow-y-hidden">
                        <div className="flex items-center gap-4 px-4 h-full min-w-max mx-auto">
                            {Rounds}
                        </div>
                    </div>
                </div>

                {/* Fixed Sidebar (only visible on md+) */}
                <div className="hidden md:block rounded bg-red-900 overflow-auto p-4 max-h-full">
                    <br />
                    {`A Votes: ${totalAVotes}`}
                    <br />
                    {`B Votes: ${totalBVotes}`}
                    <br />
                    {`${up} is up ${Math.abs(totalMedianDiff)} points!`}
                </div>
            </div>

            {/* Bottom: NameTagB pinned to bottom */}
            <div className="pt-2 pb-4 rounded overflow-hidden">{NameTagB}</div>
        </div>
    );
}
