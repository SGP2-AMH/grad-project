import { Chess, Square } from "chess.js";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { BoardTheme, PieceStyle } from "./BoardSettings";

interface ChessBoardProps {
  game: Chess;
  onMove: (from: Square, to: Square) => void;
  disabled?: boolean;
  boardTheme?: BoardTheme;
  pieceStyle?: PieceStyle;
}

const ChessBoard = ({ game, onMove, disabled, boardTheme = "classic", pieceStyle = "classic" }: ChessBoardProps) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);

  const board = game.board();
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  const getPieceSymbol = (piece: { type: string; color: string } | null) => {
    if (!piece) return "";
    
    const classicSymbols: Record<string, { w: string; b: string }> = {
      k: { w: "♔", b: "♚" },
      q: { w: "♕", b: "♛" },
      r: { w: "♖", b: "♜" },
      b: { w: "♗", b: "♝" },
      n: { w: "♘", b: "♞" },
      p: { w: "♙", b: "♟" },
    };

    const modernSymbols: Record<string, { w: string; b: string }> = {
      k: { w: "♚", b: "♔" },
      q: { w: "♛", b: "♕" },
      r: { w: "♜", b: "♖" },
      b: { w: "♝", b: "♗" },
      n: { w: "♞", b: "♘" },
      p: { w: "♟", b: "♙" },
    };

    const symbols = pieceStyle === "modern" ? modernSymbols : classicSymbols;
    return symbols[piece.type][piece.color];
  };

  const getBoardColors = (isLight: boolean) => {
    const themeColors = {
      classic: isLight ? "bg-board-classic-light" : "bg-board-classic-dark",
      wood: isLight ? "bg-board-wood-light" : "bg-board-wood-dark",
      marine: isLight ? "bg-board-marine-light" : "bg-board-marine-dark",
      coral: isLight ? "bg-board-coral-light" : "bg-board-coral-dark",
    };
    return themeColors[boardTheme];
  };

  const handleSquareClick = (square: Square) => {
    if (disabled) return;

    if (selectedSquare) {
      if (possibleMoves.includes(square)) {
        onMove(selectedSquare, square);
        setSelectedSquare(null);
        setPossibleMoves([]);
      } else {
        const moves = game.moves({ square, verbose: true });
        if (moves.length > 0) {
          setSelectedSquare(square);
          setPossibleMoves(moves.map((m) => m.to as Square));
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } else {
      const moves = game.moves({ square, verbose: true });
      if (moves.length > 0) {
        setSelectedSquare(square);
        setPossibleMoves(moves.map((m) => m.to as Square));
      }
    }
  };

  return (
    <div className="inline-block">
      <div className="grid grid-cols-8 gap-0 border-4 border-border rounded-xl overflow-hidden shadow-2xl">
        {ranks.map((rank, rankIndex) =>
          files.map((file, fileIndex) => {
            const square = `${file}${rank}` as Square;
            const piece = board[rankIndex][fileIndex];
            const isLight = (rankIndex + fileIndex) % 2 === 0;
            const isSelected = selectedSquare === square;
            const isPossibleMove = possibleMoves.includes(square);

            return (
              <button
                key={square}
                onClick={() => handleSquareClick(square)}
                className={cn(
                  "aspect-square flex items-center justify-center text-5xl sm:text-6xl transition-all duration-200 relative",
                  "hover:brightness-95 active:brightness-90 hover:scale-[0.98]",
                  getBoardColors(isLight),
                  isSelected && "ring-4 ring-inset ring-chess-square-selected brightness-110",
                  isPossibleMove && "after:absolute after:w-1/3 after:h-1/3 after:bg-chess-square-highlight after:rounded-full after:opacity-70 after:shadow-lg",
                  disabled && "cursor-not-allowed opacity-60"
                )}
                disabled={disabled}
              >
                {piece && (
                  <span className={cn(
                    "select-none transition-transform hover:scale-110",
                    piece.color === "w" 
                      ? "text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.9)]" 
                      : "text-gray-900 drop-shadow-[0_2px_2px_rgba(255,255,255,0.4)]"
                  )}>
                    {getPieceSymbol(piece)}
                  </span>
                )}
                {fileIndex === 0 && (
                  <span className="absolute left-1.5 top-1 text-xs font-bold opacity-60">
                    {rank}
                  </span>
                )}
                {rankIndex === 7 && (
                  <span className="absolute right-1.5 bottom-1 text-xs font-bold opacity-60">
                    {file}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
