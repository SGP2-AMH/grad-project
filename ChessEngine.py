from stockfish import Stockfish

# Path to your Stockfish binary (make sure to update this with the actual path to the binary)
stockfish = Stockfish(path = r"/home/user/Stockfish/src/stockfish")
print(Stockfish)

# Your FEN string (this would be extracted from your image)
fen = "r1kqp2r/n1pnb1p1/2b4p/1p1n1p2/3P4/3Q1NBQ/NPP2PPP/RN4K1 b - - 1 0"  

# Set the position to the extracted FEN
stockfish.set_fen_position([fen])

board_visual = stockfish.get_board_visual()
print(board_visual)

# Get the best move from Stockfish
best_move = stockfish.get_best_move()

print(f"Best move: {best_move}")
