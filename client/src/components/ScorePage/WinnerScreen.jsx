import Sponsor from "./Sponsor";
import WinnerState from "./WinnerStats";

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
            <div className={`${boxClass} bg-green-900`}>
                <WinnerState
                    winnerName={winnerName}
                    state={state}
                    currentRound={currentRound}
                    fighterA={fighterA}
                    fighterB={fighterB}
                />
            </div>
            <div className={`${boxClass} bg-red-950`}>
                <Sponsor />
            </div>
        </div>
    );
}
