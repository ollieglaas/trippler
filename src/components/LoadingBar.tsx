import { Progress } from "./ui/progress";

function LoadingBar({ progress }: { progress: number }) {
  return <Progress value={progress} />;
}

export default LoadingBar;
