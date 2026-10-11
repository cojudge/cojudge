import java.util.*;
class Marker {
    public int movesToChessboard(char[][] board) {
        int n = board.length;
        int[][] g = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                g[i][j] = board[i][j] == '1' ? 1 : 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if ((g[0][0] ^ g[i][0] ^ g[0][j] ^ g[i][j]) == 1) return -1;
            }
        }
        int rowOnes = 0, colOnes = 0;
        for (int j = 0; j < n; j++) rowOnes += g[0][j];
        for (int i = 0; i < n; i++) colOnes += g[i][0];
        if (rowOnes != n / 2 && rowOnes != (n + 1) / 2) return -1;
        if (colOnes != n / 2 && colOnes != (n + 1) / 2) return -1;
        int rowDiff0 = 0, colDiff0 = 0;
        for (int i = 0; i < n; i++) if (g[i][0] != (i % 2)) rowDiff0++;
        for (int j = 0; j < n; j++) if (g[0][j] != (j % 2)) colDiff0++;
        int rowMoves, colMoves;
        if (n % 2 == 0) {
            rowMoves = Math.min(rowDiff0, n - rowDiff0) / 2;
            colMoves = Math.min(colDiff0, n - colDiff0) / 2;
        } else {
            rowMoves = (rowDiff0 % 2 == 0) ? rowDiff0 / 2 : (n - rowDiff0) / 2;
            colMoves = (colDiff0 % 2 == 0) ? colDiff0 / 2 : (n - colDiff0) / 2;
        }
        return rowMoves + colMoves;
    }
    public boolean isCorrect(char[][] board, int output) {
        return movesToChessboard(board) == output;
    }
}
