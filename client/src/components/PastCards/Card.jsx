import { motion, AnimatePresence } from "framer-motion";

export default function Card({
    card,
    index,
    openCardIndex,
    toggleAccordion,
    colours,
}) {
    return (
        <div className="bg-dune shadow-lg rounded-lg overflow-hidden w-full max-w-3xl mx-auto text-center">
            <button
                onClick={() => toggleAccordion(index)}
                className={`border-${
                    colours[index % colours.length]
                } bg-white w-full px-6 py-7 focus:outline-none flex justify-between items-center`}
            >
                <div className="mx-auto">
                    <h2 className="text-lg text-black font-bold font-industry_demi">
                        {card.name}
                    </h2>
                    <p className="text-sm text-black">
                        Created:{" "}
                        {new Date(card.createdAt).toLocaleString(undefined, {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        })}
                    </p>
                </div>
                <span
                    className={`text-xl  ${
                        openCardIndex === index
                            ? "text-rich_carmine"
                            : "text-black"
                    }`}
                >
                    {openCardIndex === index ? "▲" : "▼"}
                </span>
            </button>

            <AnimatePresence initial={false}>
                {openCardIndex === index && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.1, ease: "linear" }}
                        className="px-6 py-4 space-y-4 overflow-hidden"
                    >
                        {card.fights.length === 0 ? (
                            <p>No fights in this card.</p>
                        ) : (
                            card.fights.map((fight, i) => (
                                <div key={i} className="rounded p-3 bg-dune">
                                    <p className="font-medium">
                                        {fight.fighterA} vs {fight.fighterB}
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        Sport: {fight.sport}
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        Rounds: {fight.totalRounds}
                                    </p>
                                    {fight.outcome?.winner && (
                                        <p className="text-sm text-rich_carmine mt-1">
                                            {fight.outcome.winner == "A"
                                                ? fight.fighterA
                                                : fight.fighterB}{" "}
                                            via {fight.outcome.way}
                                            {fight.outcome.round &&
                                                `${
                                                    fight.outcome.round >
                                                    fight.totalRounds
                                                        ? ""
                                                        : ` in ${fight.outcome.round}`
                                                }`}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
