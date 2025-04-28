import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { motion } from "motion/react";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.4,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, transition: { duration: 0.5 } },
  show: { opacity: 1, y: 0, transition: { duration: 1 } },
};

function Hero() {
  return (
    <motion.div
      className="flex flex-col items-center justify-between mx-8 md:mx-28 lg:mx-56 xl:mx-80 2xl:mx-96 gap-16"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.h1
        className="font-extrabold text-4xl md:text-5xl text-center leading-12 md:leading-16 mt-10 sm:mt-16 2xl:px-24"
        variants={itemVariants}
      >
        <span className="text-[#4962BF]">Plan Smarter, Travel Better -</span>{" "}
        Generate Personal Travel Plans Without The Stress
      </motion.h1>
      <motion.p
        className="text-xl text-gray-500 text-center"
        variants={itemVariants}
      >
        Let intelligent trip planning simplify your journey - personalised
        suggestions tailored to your preferences and budget.
      </motion.p>
      <motion.div variants={itemVariants}>
        <Link to={"/create-trip"}>
          <Button>Get Started</Button>
        </Link>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row justify-center items-center gap-18"
      >
        <img src={`/laptop.png`} width={"600px"} alt="" />
        <img src={`/phone.png`} width={"230px"} alt="" />
      </motion.div>
    </motion.div>
  );
}

export default Hero;
