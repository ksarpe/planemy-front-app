import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const words = [
  ["Personal", "Life", "Assistant"],
  ["AI-Powered", "Task", "Manager"],
  ["Smart", "Planning", "Tool"],
  ["Daily", "Routine", "Organizer"],
];

export const AnimatedTagline = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 4000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-6 text-center">
      {/* "Your" - larger and on top */}
      <div className="text-5xl font-bold text-text mb-2">Your</div>

      {/* Animated words - smaller and below */}
      <div className="text-2xl font-medium text-text-muted h-[2rem] overflow-hidden flex items-center justify-center gap-2">
        <span className="inline-block relative">
          <AnimatePresence mode="wait">
            <motion.span
              key={`${index}-0`}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="inline-block">
              {words[index][0]}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="inline-block relative">
          <AnimatePresence mode="wait">
            <motion.span
              key={`${index}-1`}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut", delay: 0.1 }}
              className="inline-block">
              {words[index][1]}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="inline-block relative">
          <AnimatePresence mode="wait">
            <motion.span
              key={`${index}-2`}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }}
              className="inline-block">
              {words[index][2]}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </div>
  );
};
