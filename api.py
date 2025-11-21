from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import logging
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('chess_api.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Lichess.org API for analysis
LICHESS_API = "https://lichess.org/api/cloud-eval"


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    logger.info("Health check requested")
    return jsonify({"status": "ok"}), 200


@app.route('/api/best-move', methods=['POST'])
def get_best_move():
    """
    Receives board state (FEN) and returns the best move from Chess.com AI
    
    Request body:
    {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "depth": 20
    }
    
    Response:
    {
        "success": true,
        "fen": "...",
        "bestMove": "e2e4",
        "evaluation": 25
    }
    """
    try:
        data = request.json
        fen = data.get('fen')
        
        print(f"\n\n========== FEN RECEIVED ==========\n{fen}\n==================================\n")
        logger.info(f"Best move request received - FEN: {fen}")
        
        if not fen:
            logger.warning("FEN position is required but not provided")
            return jsonify({
                "success": False,
                "error": "FEN position is required"
            }), 400
        
        # Call Lichess API
        logger.info(f"Calling Lichess API with FEN: {fen[:50]}...")
        response = requests.get(
            LICHESS_API,
            params={"fen": fen, "depth": 20},
            headers={"User-Agent": "ChessGame/1.0"},
            timeout=30
        )
        
        if response.status_code != 200:
            logger.error(f"Lichess API error: {response.status_code}")
            return jsonify({
                "success": False,
                "error": f"Lichess API error: {response.status_code}"
            }), 500
        
        api_data = response.json()
        logger.info(f"Full Lichess response: {api_data}")
        
        # Extract best move from Lichess response
        if "pvs" in api_data and api_data["pvs"]:
            best_pv = api_data["pvs"][0]
            moves = best_pv.get("moves", "").split()
            best_move = moves[0] if moves else None
            evaluation = best_pv.get("cp")
            logger.info(f"PVS found - best_pv: {best_pv}")
        else:
            best_move = None
            evaluation = None
            logger.warning(f"No PVS in response. Available keys: {api_data.keys()}")
        
        logger.info(f"Lichess API response - Move: {best_move}, Evaluation: {evaluation}")
        
        if not best_move:
            logger.error("No move returned from Lichess API")
            return jsonify({
                "success": False,
                "error": "No move returned from Lichess API"
            }), 500
        
        logger.info(f"Returning best move: {best_move}")
        return jsonify({
            "success": True,
            "fen": fen,
            "bestMove": best_move,
            "evaluation": evaluation,
            "mate": None
        }), 200
    
    except requests.exceptions.Timeout:
        logger.error("Lichess API timeout")
        return jsonify({
            "success": False,
            "error": "Lichess API timeout"
        }), 504
    except requests.exceptions.RequestException as e:
        logger.error(f"Network error: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Network error: {str(e)}"
        }), 500
    except Exception as e:
        logger.error(f"Error: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": f"Error: {str(e)}"
        }), 500


@app.route('/api/analyze', methods=['POST'])
def analyze_position():
    """
    Analyzes a position using Chess.com API
    """
    try:
        data = request.json
        fen = data.get('fen')
        
        logger.info(f"Analyze position request - FEN: {fen[:50] if fen else 'None'}...")
        
        if not fen:
            logger.warning("FEN position is required but not provided")
            return jsonify({
                "success": False,
                "error": "FEN position is required"
            }), 400
        
        logger.info(f"Calling Lichess API for analysis")
        response = requests.get(
            LICHESS_API,
            params={"fen": fen, "depth": 20},
            headers={"User-Agent": "ChessGame/1.0"},
            timeout=30
        )
        
        if response.status_code != 200:
            logger.error(f"Lichess API error: {response.status_code}")
            return jsonify({
                "success": False,
                "error": f"Lichess API error: {response.status_code}"
            }), 500
        
        api_data = response.json()
        logger.info(f"Full Lichess response: {api_data}")
        
        # Extract best move from Lichess response
        if "pvs" in api_data and api_data["pvs"]:
            best_pv = api_data["pvs"][0]
            moves = best_pv.get("moves", "").split()
            best_move = moves[0] if moves else None
            evaluation = best_pv.get("cp")
            logger.info(f"PVS found - best_pv: {best_pv}")
        else:
            best_move = None
            evaluation = None
            logger.warning(f"No PVS in response. Available keys: {api_data.keys()}")
        
        logger.info(f"Analysis complete - Move: {best_move}")
        
        return jsonify({
            "success": True,
            "fen": fen,
            "bestMove": best_move,
            "evaluation": evaluation,
            "mate": None
        }), 200
    
    except requests.exceptions.Timeout:
        logger.error("Lichess API timeout")
        return jsonify({
            "success": False,
            "error": "Lichess API timeout"
        }), 504
    except requests.exceptions.RequestException as e:
        logger.error(f"Network error: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Network error: {str(e)}"
        }), 500
    except Exception as e:
        logger.error(f"Error: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": f"Error: {str(e)}"
        }), 500


@app.route('/api/validate-fen', methods=['POST'])
def validate_fen():
    """Validates if a FEN string is valid"""
    try:
        data = request.json
        fen = data.get('fen')
        
        logger.info(f"FEN validation request - FEN: {fen[:50] if fen else 'None'}...")
        
        if not fen:
            logger.warning("FEN position is required but not provided")
            return jsonify({
                "success": False,
                "error": "FEN position is required"
            }), 400
        
        # Try to get a move - if it works, FEN is valid
        logger.info("Validating FEN with Lichess API")
        response = requests.get(
            LICHESS_API,
            params={"fen": fen, "depth": 1},
            headers={"User-Agent": "ChessGame/1.0"},
            timeout=10
        )
        
        is_valid = response.status_code == 200
        logger.info(f"FEN validation result: {is_valid}")
        
        return jsonify({
            "success": True,
            "valid": is_valid,
            "fen": fen
        }), 200
    
    except Exception as e:
        logger.error(f"FEN validation error: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "valid": False,
            "error": f"Error: {str(e)}"
        }), 500


if __name__ == '__main__':
    logger.info("Starting Chess API server on http://0.0.0.0:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
