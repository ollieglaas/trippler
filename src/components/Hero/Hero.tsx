import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import Image from "/heroicons/image1.jpg";
import { RiInputField } from "react-icons/ri";
import { BsStars } from "react-icons/bs";
import { FaListCheck } from "react-icons/fa6";

interface HowToTypes {
  icon: React.ReactNode;
  title: string;
  description: string;
}

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

const howToGuide: HowToTypes[] = [
  {
    icon: <RiInputField />,
    title: "Select Your Preferences",
    description:
      "Use the input form to select your destination, dates, budget and how many people are travelling",
  },
  {
    icon: <BsStars />,
    title: "AI Generated Itinerary",
    description:
      "Instantly receive a personalised travel plan with curated activities, places to visit, and daily schedules tailored to your preferences",
  },
  {
    icon: <FaListCheck />,
    title: "Tailor Your Own Timeline",
    description:
      "Edit and customise your itinerary by adding, removing or rearranging activities to perfectly match your travel style",
  },
];

function Hero() {
  return (
    <motion.div
      className="flex flex-col items-center justify-between pt-12 lg:pt-0"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div className="grid grid-cols-1 xl:grid-cols-2 w-full">
        <motion.div className="col-span-1 flex flex-col justify-center items-start p-12 md:p-18 lg:p-28 gap-4 bg-white">
          <motion.h1
            variants={itemVariants}
            className="text-[#4962BF] text-5xl md:text-[58px] font-extrabold"
          >
            AI-Powered Travel Planning,{" "}
            <span className="text-gray-800">Simplified</span>
          </motion.h1>
          <motion.h1 variants={itemVariants} className="text-xl text-gray-800">
            Disover your perfect journey with personalised suggestions tailored
            to your budget and style
          </motion.h1>

          <motion.div variants={itemVariants} className="">
            <Link to={"/create-trip"}>
              <Button className="w-full py-6">
                <span className="text-lg">Get Started</span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div className="col-span-1">
          <img
            src={Image}
            alt="Travel planning preview"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="w-full h-full grid grid-cols-1 lg:grid-cols-3 px-32 md:px-42  py-12 lg:py-24 gap-12"
        variants={containerVariants}
      >
        {howToGuide.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="col-span-1 flex flex-col justify-center items-center gap-4"
          >
            <div className="text-[#366e9c] text-5xl">{item.icon}</div>
            <h3 className="font-semibold text-xl md:text-2xl text-center">
              {item.title}
            </h3>
            <p className="text-center text-sm md:text-lg text-gray-600">
              {item.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Hero;
