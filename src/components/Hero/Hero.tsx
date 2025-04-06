import { Link } from "react-router-dom";
import { Button } from "../ui/button";

function Hero() {
  return (
    <div className="flex flex-col items-center justify-between mx-8 md:mx-28 lg:mx-56 xl:mx-80 2xl:mx-96 gap-16">
      <h1 className="font-extrabold text-4xl md:text-5xl text-center leading-12 md:leading-16 mt-10 sm:mt-16 2xl:px-24">
        <span className="text-[#4962BF]">Plan Smarter, Travel Better -</span>{" "}
        Generate Personal Travel Plans Without The Stress
      </h1>
      <p className="text-xl text-gray-500 text-center">
        Let intelligent trip planning simplify your journey - personalised
        suggestions tailored to your preferences and budget.
      </p>
      <Link to={"/create-trip"}>
        <Button>Get Started</Button>
      </Link>
      <div className="flex flex-col lg:flex-row justify-center items-center gap-18">
        <img src={`/laptop.png`} width={"600px"} alt="" />
        <img src={`/phone.png`} width={"230px"} alt="" />
      </div>
    </div>
  );
}

export default Hero;
