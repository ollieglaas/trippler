import { Link } from "react-router-dom";
import { Button } from "../ui/button";

function Hero() {
  return (
    <div className="flex flex-col items-center justify-between mx-22 md:mx-56 xl:mx-80 gap-16">
      <h1 className="font-extrabold text-4xl md:text-5xl text-center leading-12 md:leading-16 mt-16">
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
      <img src={`/laptop.png`} width={"600px"} alt="" />
    </div>
  );
}

export default Hero;
