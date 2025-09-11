import { motion } from "framer-motion";

const variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror" as const,
      duration: 1,
      ease: "circIn",
    },
  },
};

export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <motion.div
        transition={{
          staggerChildren: 0.25,
        }}
        initial="initial"
        animate="animate"
        className="flex gap-1 justify-center">
        <motion.div variants={variants} className="h-12 w-2 bg-primary" />
        <motion.div variants={variants} className="h-12 w-2 bg-primary" />
        <motion.div variants={variants} className="h-12 w-2 bg-primary" />
        <motion.div variants={variants} className="h-12 w-2 bg-primary" />
        <motion.div variants={variants} className="h-12 w-2 bg-primary" />
      </motion.div>
    </div>
  );
}
