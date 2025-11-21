import { useState } from "react";
import { Chess, Square } from "chess.js";
import { useToast } from "@/hooks/use-toast";
import { useStockfish } from "@/hooks/use-stockfish";
import NameEntry from "@/components/NameEntry";
import ChessBoard from "@/components/ChessBoard";
import Timer from "@/components/Timer";
import MoveHistory from "@/components/MoveHistory";
import GameControls from "@/components/GameControls";
import BoardSettings, { BoardTheme, PieceStyle } from "@/components/BoardSettings";

interface Move {
  moveNumber: number;
  white: string;
  black?: string;
}

const Index = () => {
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [game, setGame] = useState(new Chess());
  const [moves, setMoves] = useState<Move[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [boardTheme, setBoardTheme] = useState<BoardTheme>("classic");
  const [pieceStyle, setPieceStyle] = useState<PieceStyle>("classic");
  const { toast } = useToast();
  const { getBestMove, loading: stockfishLoading, error: stockfishError } = useStockfish();

  const isPlayerTurn = game.turn() === "w";

  const handleMove = (from: Square, to: Square) => {
    try {
      const result = game.move({ from, to, promotion: "q" });
      
      if (result) {
        const moveNumber = Math.floor(game.history().length / 2) + (game.history().length % 2);
        const isWhiteMove = result.color === "w";
        
        setMoves((prev) => {
          const newMoves = [...prev];
          if (isWhiteMove) {
            newMoves.push({
              moveNumber,
              white: result.san,
            });
          } else {
            const lastMove = newMoves[newMoves.length - 1];
            if (lastMove) {
              lastMove.black = result.san;
            }
          }
          return newMoves;
        });

        // Create new game instance to trigger re-render
        const updatedGame = new Chess(game.fen());
        setGame(updatedGame);

        if (updatedGame.isGameOver()) {
          handleGameOver();
        } else if (isWhiteMove) {
          // After white (player) moves, it's black's (robot) turn
          setTimeout(() => makeRobotMove(updatedGame), 1000);
        }
      }
    } catch (error) {
      console.error("Invalid move:", error);
    }
  };

  const makeRobotMove = async (currentGame: Chess) => {
    try {
      const fen = currentGame.fen();
      console.log("Making robot move with FEN:", fen);
      
      const response = await getBestMove(fen, 20);
      
      if (!response || !response.bestMove) {
        console.error("No best move returned:", response);
        toast({
          title: "Error",
          description: "Failed to get move from Stockfish",
          variant: "destructive",
        });
        return;
      }

      console.log("Best move received:", response.bestMove);
      
      const bestMove = response.bestMove;
      const from = bestMove.substring(0, 2) as Square;
      const to = bestMove.substring(2, 4) as Square;

      console.log("Playing move:", from, "to", to);
      handleMove(from, to);

      // Show evaluation
      if (response.evaluation !== null) {
        const evaluation = (response.evaluation / 100).toFixed(2);
        toast({
          title: "Stockfish Analysis",
          description: `Evaluation: ${evaluation} (mate in ${response.mate || 'none'})`,
        });
      }
    } catch (error) {
      console.error("Error making robot move:", error);
      toast({
        title: "Error",
        description: "Failed to connect to Stockfish engine",
        variant: "destructive",
      });
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
    let message = "";
    
    if (game.isCheckmate()) {
      message = game.turn() === "w" ? "Robotic Arm wins by checkmate!" : `${playerName} wins by checkmate!`;
    } else if (game.isDraw()) {
      message = "Game drawn!";
    } else if (game.isStalemate()) {
      message = "Game drawn by stalemate!";
    }

    toast({
      title: "Game Over",
      description: message,
    });
  };

  const handleResign = () => {
    setGameOver(true);
    toast({
      title: "Game Over",
      description: `${playerName} resigned. Robotic Arm wins!`,
    });
  };

  const handleOfferDraw = () => {
    toast({
      title: "Draw Offered",
      description: "The robotic arm is considering your draw offer...",
    });
    
    setTimeout(() => {
      const accepts = Math.random() > 0.5;
      if (accepts) {
        setGameOver(true);
        toast({
          title: "Draw Accepted",
          description: "Game ended in a draw by agreement.",
        });
      } else {
        toast({
          title: "Draw Declined",
          description: "The robotic arm wants to continue playing.",
        });
      }
    }, 2000);
  };

  const handleRestart = () => {
    setGame(new Chess());
    setMoves([]);
    setGameOver(false);
    toast({
      title: "Game Restarted",
      description: "Starting a fresh game!",
    });
  };

  if (!playerName) {
    return <NameEntry onNameSubmit={setPlayerName} />;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center">
              {playerName} vs Stockfish
            </h1>
            <BoardSettings
              boardTheme={boardTheme}
              pieceStyle={pieceStyle}
              onBoardThemeChange={setBoardTheme}
              onPieceStyleChange={setPieceStyle}
            />
          </div>

          {stockfishLoading && (
            <div className="text-center mb-4 text-yellow-600">
              Stockfish is analyzing...
            </div>
          )}

          {stockfishError && (
            <div className="text-center mb-4 text-red-600">
              Stockfish Error: {stockfishError}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_300px] gap-6 items-start">
            {/* Left side - Timers and Controls */}
            <div className="space-y-4">
              <Timer
                initialTime={600}
                isActive={!isPlayerTurn && !gameOver}
                label="Stockfish"
              />
              <Timer
                initialTime={600}
                isActive={isPlayerTurn && !gameOver}
                label={playerName}
              />
              <GameControls
                onResign={handleResign}
                onOfferDraw={handleOfferDraw}
                onRestart={handleRestart}
                disabled={gameOver}
              />
            </div>

            {/* Center - Chess Board */}
            <div className="flex justify-center">
              <ChessBoard
                game={game}
                onMove={handleMove}
                disabled={!isPlayerTurn || gameOver || stockfishLoading}
                boardTheme={boardTheme}
                pieceStyle={pieceStyle}
              />
            </div>

            {/* Right side - Move History */}
            <MoveHistory moves={moves} playerName={playerName} />
          </div>
        </div>
      </div>
  );
};

export default Index;
