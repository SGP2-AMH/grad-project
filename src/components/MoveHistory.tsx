import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Bot } from "lucide-react";

interface Move {
  moveNumber: number;
  white: string;
  black?: string;
}

interface MoveHistoryProps {
  moves: Move[];
  playerName: string;
}

const MoveHistory = ({ moves, playerName }: MoveHistoryProps) => {
  return (
    <Card className="h-full shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Move History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="px-4 pb-4">
            {moves.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No moves yet
              </p>
            ) : (
              <div className="space-y-2">
                {moves.map((move) => (
                  <div
                    key={move.moveNumber}
                    className="border border-border/50 rounded-lg p-3 hover:bg-history-hover transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {move.moveNumber}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs text-muted-foreground font-medium">
                          {playerName}:
                        </span>
                        <span className="text-sm font-semibold">
                          {move.white}
                        </span>
                      </div>
                      {move.black && (
                        <div className="flex items-center gap-2">
                          <Bot className="h-3.5 w-3.5 text-accent" />
                          <span className="text-xs text-muted-foreground font-medium">
                            Robotic Arm:
                          </span>
                          <span className="text-sm font-semibold">
                            {move.black}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MoveHistory;
