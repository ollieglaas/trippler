import { motion } from "motion/react";
import Hero from "./components/Hero/Hero";
import { useTheme } from "./components/theme-provider";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 }, // ← this is key
};

function App() {
  const { theme } = useTheme();
  return (
    <motion.div
      className={`min-h-screen mt-15 ${theme === "light" && "bg-gray-100"}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Hero />
    </motion.div>
  );
}

export default App;
