import { useState } from 'react';

interface StockfishResponse {
  success: boolean;
  fen: string;
  bestMove: string | null;
  evaluation: number | null;
  mate: number | null;
  error?: string;
}

const STOCKFISH_API = 'http://localhost:5000';

export const useStockfish = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBestMove = async (
    fen: string,
    depth: number = 20
  ): Promise<StockfishResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔄 Sending FEN to API:", fen);
      console.log("📍 API URL:", `${STOCKFISH_API}/api/best-move`);
      
      const response = await fetch(`${STOCKFISH_API}/api/best-move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fen, depth }),
      });

      console.log("📊 API Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data: StockfishResponse = await response.json();
      
      console.log("✅ API Response Data:", data);

      if (!data.success) {
        setError(data.error || 'Failed to get best move');
        console.error("❌ API Error:", data.error);
        return null;
      }

      console.log("🎯 Best Move:", data.bestMove);
      return data;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      console.error('❌ Stockfish API error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const analyzePosition = async (
    fen: string,
    depth: number = 20,
    multiPv: number = 1
  ): Promise<StockfishResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${STOCKFISH_API}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fen, depth, multiPv }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data: StockfishResponse = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to analyze position');
        return null;
      }

      return data;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      console.error('Stockfish API error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const validateFEN = async (fen: string): Promise<boolean> => {
    try {
      const response = await fetch(`${STOCKFISH_API}/api/validate-fen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fen }),
      });

      const data = await response.json();
      return data.success && data.valid;
    } catch (err) {
      console.error('FEN validation error:', err);
      return false;
    }
  };

  return {
    getBestMove,
    analyzePosition,
    validateFEN,
    loading,
    error,
  };
};
