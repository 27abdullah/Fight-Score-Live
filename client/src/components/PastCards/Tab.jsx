export default function Tab({ fight, i }) {
    console.log("fight", fight);
    return (
        <div key={i} className="p-3 bg-dune border-zeus border-b-2">
            <p className="font-medium">
                {fight.fighterA} vs {fight.fighterB}
            </p>
            <p className="text-sm text-gray-300">Sport: {fight.sport}</p>
            <p className="text-sm text-gray-300">Rounds: {fight.totalRounds}</p>
            {fight.outcome?.winner && (
                <p className="text-sm text-rich_carmine mt-1">
                    {fight.outcome.winner == "A"
                        ? fight.fighterA
                        : fight.fighterB}{" "}
                    via {fight.outcome.way}
                    {fight.outcome.round &&
                        `${
                            fight.outcome.round > fight.totalRounds
                                ? ""
                                : ` in ${fight.outcome.round}`
                        }`}
                </p>
            )}
        </div>
    );
}
