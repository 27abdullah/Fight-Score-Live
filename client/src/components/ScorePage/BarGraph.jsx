import { motion } from "framer-motion";

export function BarGraph({ votesA, votesB, direction }) {
    const stats = direction ? votesA : votesB;
    const total = votesA + votesB;
    const p = stats / total;
    const clampedP = Math.min(Math.max(p, 0), 1);
    const peakY = 100 - clampedP * 199;
    const pathD = `M0,100 Q50,${peakY} 100,100`;
    const median = 0; //TODO placeholder for median value
    const fill = direction
        ? "rgba(220, 38, 38, 0.9)" // red-500
        : "rgba(59, 130, 246, 0.9)"; // blue-500

    if (total === 0 || stats <= 0) return null;

    return (
        <div className="relative w-20 sm:w-20 md:w-24 h-[10vh] md:h-[15vh]">
            {/* Number overlay */}
            <div
                className={`absolute left-1/2 transform -translate-x-1/2 text-xs sm:text-sm md:text-base font-semibold text-white z-10 ${
                    direction ? "bottom-1" : "top-1"
                }`}
            >
                {median}
            </div>

            {/* SVG curve */}
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ transform: direction ? "scaleY(1)" : "scaleY(-1)" }}
            >
                <motion.path
                    d={pathD}
                    fill={fill}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                />
            </svg>
        </div>
    );
}

export default BarGraph;
