import { motion, AnimatePresence } from "framer-motion";
import Tab from "./Tab";

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
                                <Tab key={i} fight={fight} i={i} />
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
