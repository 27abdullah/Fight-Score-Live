export default function RoundSummary({ fight }) {
    const medians = fight.stats.medianDiff;
    return (
        <div className="flex flex-wrap gap-1 items-center justify-center my-8">
            {medians
                .filter((num) => num !== null && num !== undefined)
                .map((num, idx) => {
                    const absValue = Math.abs(num);
                    let bgColor = "bg-white text-black border";

                    if (num > 0) {
                        bgColor = "bg-dodger text-white";
                    } else if (num < 0) {
                        bgColor = "bg-cadmium text-white";
                    }

                    return (
                        <div
                            key={idx}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${bgColor}`}
                        >
                            +{absValue}
                        </div>
                    );
                })}
        </div>
    );
}
