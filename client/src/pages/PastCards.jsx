import { useEffect, useState } from "react";

export default function PastCards() {
    const [pastCards, setPastCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCardIndex, setOpenCardIndex] = useState(null);
    const colours = [
        "bg-blue-900", // deep blue
        "bg-slate-900", // cool dark slate blue
        "bg-indigo-900", // dark indigo
        "bg-cyan-900", // dark cyan blue
        "bg-sky-900", // dark sky blue
    ];

    useEffect(() => {
        const fetchPastCards = async () => {
            const response = await fetch(
                "http://localhost:4000/api/past-cards"
            );

            if (!response.ok) {
                console.error("Failed to fetch past cards");
                setLoading(true);
                return;
            }

            const json = await response.json();
            setPastCards(json.data || []);
            setLoading(false);
        };

        fetchPastCards();
    }, []);

    const toggleAccordion = (index) => {
        setOpenCardIndex(openCardIndex === index ? null : index);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold mb-4">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen  p-4 md:p-8">
            <h1 className="text-3xl font-bold text-center mb-6">Past Cards</h1>

            <div className="max-w-3xl mx-auto space-y-4">
                {pastCards.map((card, index) => (
                    <div
                        key={card._id}
                        className="bg-slate-600 shadow rounded-lg overflow-hidden"
                    >
                        <button
                            onClick={() => toggleAccordion(index)}
                            className={`${
                                colours[index % colours.length]
                            } w-full px-6 py-4 text-left focus:outline-none focus:ring flex justify-between items-center`}
                        >
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {card.name}
                                </h2>
                                <p className="text-sm ">Owner: {card.owner}</p>
                            </div>
                            <span className="text-xl">
                                {openCardIndex === index ? "▲" : "▼"}
                            </span>
                        </button>

                        {openCardIndex === index && (
                            <div className=" px-6 py-4 space-y-4">
                                {card.fights.length === 0 ? (
                                    <p className="">No fights in this card.</p>
                                ) : (
                                    card.fights.map((fight, i) => (
                                        <div
                                            key={i}
                                            className="bg-black rounded p-3"
                                        >
                                            <p className="font-medium">
                                                {fight.fighterA} vs{" "}
                                                {fight.fighterB}
                                            </p>
                                            <p className="text-sm text-gray-300">
                                                Sport: {fight.sport}
                                            </p>
                                            <p className="text-sm text-gray-300">
                                                Rounds: {fight.totalRounds}
                                            </p>
                                            {fight.outcome?.winner && (
                                                <p className="text-sm text-green-700 mt-1">
                                                    Winner:{" "}
                                                    {fight.outcome.winner} via{" "}
                                                    {fight.outcome.way}
                                                    {fight.outcome.round &&
                                                        `${
                                                            fight.outcome
                                                                .round >
                                                            fight.totalRounds
                                                                ? "Decision"
                                                                : ` in ${fight.outcome.round}`
                                                        }`}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
