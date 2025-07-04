import StatsTab from "./StatsTab";

export default function Grid({
    Banner,
    NameTagA,
    NameTagB,
    Rounds,
    state,
    currentRound,
    fighterA,
    fighterB,
    socket,
    roomId,
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
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-zeus">
            {/* Top: Banner*/}
            <div className="rounded overflow-hidden">{Banner}</div>

            {/* Middle: Main Content + Stats */}
            <div className="flex-grow min-h-0 min-w-0 p-4 flex flex-col md:grid md:grid-cols-[2fr_1fr] gap-2">
                {/* < md Stats */}
                <div className="md:hidden p-4 h-[20%] bg-dune shdadow-lg rounded-lg">
                    <StatsTab
                        socket={socket}
                        roomId={roomId}
                        fighterA={fighterA}
                        fighterB={fighterB}
                        totalAVotes={totalAVotes}
                        totalBVotes={totalBVotes}
                        up={up}
                        totalMedianDiff={totalMedianDiff}
                        isMobile={true}
                    />
                </div>

                {/* Main Content: Fighters and Rounds */}
                <div className="flex flex-1 overflow-hidden flex-col bg-dune shadow-lg rounded-lg">
                    <div className="bg-white">{NameTagA}</div>
                    {/* Scrollable Rounds Section */}
                    <div className="flex flex-1 overflow-x-auto overflow-y-hidden bg-dune rounded">
                        <div className="flex items-center gap-4 px-4 h-full min-w-max mx-auto">
                            {Rounds}
                        </div>
                    </div>
                    <div className="bg-white">{NameTagB}</div>
                </div>

                {/* md+ Stats */}
                <div className="hidden md:block rounded-lg bg-dune overflow-auto p-4 max-h-full shadow-lg">
                    <StatsTab
                        socket={socket}
                        roomId={roomId}
                        fighterA={fighterA}
                        fighterB={fighterB}
                        totalAVotes={totalAVotes}
                        totalBVotes={totalBVotes}
                        up={up}
                        totalMedianDiff={totalMedianDiff}
                        isMobile={false}
                    />
                </div>
            </div>
        </div>
    );
}
