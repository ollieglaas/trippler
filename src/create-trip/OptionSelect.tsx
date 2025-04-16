import { useTheme } from "@/components/theme-provider";
import React, { MouseEventHandler } from "react";

interface OptionSelectProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: MouseEventHandler<HTMLDivElement>;
  selected: boolean;
}

function OptionSelect({
  title,
  description,
  icon,
  onClick,
  selected,
}: OptionSelectProps) {
  const { theme } = useTheme();
  const borderColor = theme === "light" ? "border-black" : "border-white";
  return (
    <div
      className={`p-4 flex flex-col gap-2 border ${
        selected && borderColor + " shadow-xl"
      } rounded-lg shadow-sm hover:shadow-lg  transition duration-200 ease-in-out cursor-pointer ${
        theme === "light" ? "bg-white" : "bg-card"
      }`}
      onClick={onClick}
    >
      <div className="flex flex-row justify-between items-center">
        <h3 className="font-semibold text-xl">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}

export default OptionSelect;
