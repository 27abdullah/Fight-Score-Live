import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SocialMediaTags from "./SocialMediaTags";

export default function ScrollingBanner({ items }) {
    return (
        <div className="overflow-hidden bg-red-900 text-white py-2 bg-opacity-65 border-t-2 border-b-2 border-black">
            <div className="relative whitespace-nowrap w-full overflow-hidden">
                <motion.div
                    className="inline-flex gap-4 min-w-full"
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{
                        duration: 60,
                        repeat: Infinity,
                        ease: "linear",
                    }}
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
