import Sponsor from "./Sponsor";
import WinnerStats from "./WinnerStats";

export default function WinnerScreen({
    winnerName,
    state,
    currentRound,
    fighterA,
    fighterB,
}) {
    const boxClass =
        "flex flex-1 items-center justify-center min-w-0 rounded-3xl m-1";
    return (
        <div className="flex flex-col sm:flex-row h-full w-full overflow-hidden p-4">
            <div className={`${boxClass}`}>
                <WinnerStats
                    winnerName={winnerName}
                    state={state}
                    currentRound={currentRound}
                    fighterA={fighterA}
                    fighterB={fighterB}
                />
            </div>
            <div className={`${boxClass} bg-dune shadow-lg`}>
                <Sponsor />
            </div>
        </div>
    );
}
