import { Button } from "@/components/ui/button";
import { Moon, Sun, RotateCcw } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface GameControlsProps {
  onResign: () => void;
  onOfferDraw: () => void;
  onRestart: () => void;
  disabled?: boolean;
}

const GameControls = ({ onResign, onOfferDraw, onRestart, disabled }: GameControlsProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="destructive"
        onClick={onResign}
        disabled={disabled}
        className="shadow-md"
      >
        Resign
      </Button>
      <Button
        variant="secondary"
        onClick={onOfferDraw}
        disabled={disabled}
        className="shadow-md"
      >
        Offer Draw
      </Button>
      <Button
        variant="outline"
        onClick={onRestart}
        className="shadow-md"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Restart
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="ml-auto rounded-full hover:bg-accent/50 transition-all"
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 transition-transform hover:rotate-180 duration-500" />
        ) : (
          <Moon className="h-5 w-5 transition-transform hover:-rotate-12 duration-300" />
        )}
      </Button>
    </div>
  );
};

export default GameControls;
