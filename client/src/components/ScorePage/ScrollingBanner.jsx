import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SocialMediaTags from "./SocialMediaTags";

export default function ScrollingBanner({ items }) {
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [contentWidth, setContentWidth] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            setContainerWidth(container.offsetWidth);
            setContentWidth(container.scrollWidth);
        }
    }, [items]);

    return (
        <div className="overflow-hidden bg-red-900 text-white py-2 mb-2 rounded-lg bg-opacity-65">
            <div ref={containerRef} className="relative whitespace-nowrap">
                <motion.div
                    animate={{ x: [containerWidth, -contentWidth] }}
                    transition={{
                        duration: 60,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="inline-flex gap-4"
                >
                    {items.map((item, index) => (
                        <span key={index} className="px-10 text-lg">
                            {item}
                        </span>
                    ))}
                    <SocialMediaTags />
                </motion.div>
            </div>
        </div>
    );
}
