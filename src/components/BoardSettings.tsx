import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2 } from "lucide-react";

export type BoardTheme = "classic" | "wood" | "marine" | "coral";
export type PieceStyle = "classic" | "modern";

interface BoardSettingsProps {
  boardTheme: BoardTheme;
  pieceStyle: PieceStyle;
  onBoardThemeChange: (theme: BoardTheme) => void;
  onPieceStyleChange: (style: PieceStyle) => void;
}

const BoardSettings = ({
  boardTheme,
  pieceStyle,
  onBoardThemeChange,
  onPieceStyleChange,
}: BoardSettingsProps) => {
  const themes = [
    { value: "classic" as BoardTheme, label: "Classic Green", colors: "bg-gradient-to-br from-emerald-200 to-emerald-600" },
    { value: "wood" as BoardTheme, label: "Wooden Board", colors: "bg-gradient-to-br from-amber-200 to-amber-800" },
    { value: "marine" as BoardTheme, label: "Marine Blue", colors: "bg-gradient-to-br from-blue-200 to-blue-600" },
    { value: "coral" as BoardTheme, label: "Coral Sunset", colors: "bg-gradient-to-br from-rose-200 to-rose-600" },
  ];

  const pieceStyles = [
    { value: "classic" as PieceStyle, label: "Classic Pieces" },
    { value: "modern" as PieceStyle, label: "Modern Pieces" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="shadow-md rounded-full">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Board Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => onBoardThemeChange(theme.value)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 w-full">
              <div className={`w-6 h-6 rounded ${theme.colors}`} />
              <span className={boardTheme === theme.value ? "font-bold" : ""}>
                {theme.label}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Piece Style</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {pieceStyles.map((style) => (
          <DropdownMenuItem
            key={style.value}
            onClick={() => onPieceStyleChange(style.value)}
            className="cursor-pointer"
          >
            <span className={pieceStyle === style.value ? "font-bold" : ""}>
              {style.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BoardSettings;
