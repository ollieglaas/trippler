import Hero from "./components/Hero/Hero";
import { useTheme } from "./components/theme-provider";

function App() {
  const { theme } = useTheme();
  return (
    <div className={`min-h-screen mt-15 ${theme === "light" && "bg-gray-100"}`}>
      <Hero />
    </div>
  );
}

export default App;
