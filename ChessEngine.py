from stockfish import Stockfish
import json

# -------------------------- #
#   1. Load FEN from file    #
# -------------------------- #
with open("predicted_board.fen", "r") as f:
    fen = f.read().strip()

# -------------------------- #
#   2. Load Stockfish        #
# -------------------------- #
stockfish = Stockfish(
    path=r"D:\downloads\stockfish-windows-x86-64-avx2\stockfish\stockfish-windows-x86-64-avx2.exe"
)

stockfish.set_fen_position(fen)

# -------------------------- #
#   3. Get best move         #
# -------------------------- #
best_move = stockfish.get_best_move()  # e.g. "a1e4"
print("Best move:", best_move)

start = best_move[0:2]
end = best_move[2:4]

# -------------------------- #
#   4. Parse FEN to detect   #
#        a capture           #
# -------------------------- #

def fen_to_board(fen_board):
    """
    Converts the first part of the FEN into a dict:
    e.g. {'a8': 'r', 'b8': 'n', ... }
    """
    board = {}
    ranks = fen_board.split('/')
    files = "abcdefgh"

    rank_num = 8
    for rank in ranks:
        file_idx = 0
        for char in rank:
            if char.isdigit():
                file_idx += int(char)
            else:
                square = files[file_idx] + str(rank_num)
                board[square] = char
                file_idx += 1
        rank_num -= 1

    return board

fen_board = fen.split()[0]      # First part = placement
board = fen_to_board(fen_board)

# A capture happens if the end square contains any piece
capture = end in board

# -------------------------- #
#   5. Format output         #
# -------------------------- #
move_json = {
    "start": start,
    "end": end,
    "capture": "true" if capture else "false"
}

print(json.dumps(move_json, indent=2))
