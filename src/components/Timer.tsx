import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TimerProps {
  initialTime: number;
  isActive: boolean;
  label: string;
  onTimeUp?: () => void;
}

const Timer = ({ initialTime, isActive, label, onTimeUp }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft < 60;

  return (
    <Card className={cn(
      "p-5 transition-all duration-300 shadow-lg",
      isActive && "ring-2 ring-primary shadow-xl scale-[1.02]",
      isWarning && isActive && "ring-timer-warning animate-pulse"
    )}>
      <div className="text-center">
        <div className="text-sm font-semibold text-muted-foreground mb-2 tracking-wide uppercase">
          {label}
        </div>
        <div className={cn(
          "text-4xl font-bold tabular-nums transition-colors",
          isWarning && "text-timer-warning"
        )}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </div>
    </Card>
  );
};

export default Timer;
