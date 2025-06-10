import { motion } from "framer-motion";

export function BarGraph({ votesA, votesB, direction }) {
    const stats = direction ? votesA : votesB;
    const p = stats / (votesA + votesB);
    const clampedP = Math.min(Math.max(p, 0), 1);
    const peakY = 100 - clampedP * 199;

    const pathD = `M0,100 Q50,${peakY} 100,100`;

    const fill = direction
        ? "rgba(220, 38, 38, 0.9)" // Tailwind red-500
        : "rgba(59, 130, 246, 0.9"; // Tailwind blue-500

    return votesA + votesB === 0 || stats <= 0 ? null : (
        <div className="w-16 sm:w-20 md:w-24 h-[10vh] md:h-[15vh]">
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
