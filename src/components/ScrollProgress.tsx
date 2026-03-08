import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();

    // Smooth, physics-based spring animation for the progress bar
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 z-[100] pointer-events-none origin-left bg-gradient-to-r from-sky-400 to-blue-600"
            style={{ scaleX }}
        />
    );
};

export default ScrollProgress;
