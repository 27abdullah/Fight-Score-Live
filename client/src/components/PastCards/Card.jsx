import { motion, AnimatePresence } from "framer-motion";

export default function Card({
    card,
    index,
    openCardIndex,
    toggleAccordion,
    colours,
}) {
    return (
        <div className="bg-slate-600 shadow rounded-lg overflow-hidden">
            <button
                onClick={() => toggleAccordion(index)}
                className={`${
                    colours[index % colours.length]
                } w-full px-6 py-4 text-left focus:outline-none focus:ring flex justify-between items-center`}
            >
                <div>
                    <h2 className="text-lg text-center font-bold">
                        {card.name}
                    </h2>
                    <p className="text-sm ">
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
                <span className="text-xl">
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
                                <div key={i} className="bg-black rounded p-3">
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
                                        <p className="text-sm text-green-700 mt-1">
                                            Winner: {fight.outcome.winner} via{" "}
                                            {fight.outcome.way}
                                            {fight.outcome.round &&
                                                `${
                                                    fight.outcome.round >
                                                    fight.totalRounds
                                                        ? "Decision"
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
