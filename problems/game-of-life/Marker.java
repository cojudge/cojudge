import java.util.*;
class Marker {
    public int[][] gameOfLife(int[][] board) {
        int m = board.length, n = board[0].length;
        int[][] next = new int[m][n];
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                int live = 0;
                for (int dr = -1; dr <= 1; dr++) {
                    for (int dc = -1; dc <= 1; dc++) {
                        if (dr == 0 && dc == 0) continue;
                        int nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] == 1) live++;
                    }
                }
                if (board[r][c] == 1) next[r][c] = (live == 2 || live == 3) ? 1 : 0;
                else next[r][c] = (live == 3) ? 1 : 0;
            }
        }
        return next;
    }
    public boolean isCorrect(int[][] board, int[][] output) {
        return Arrays.deepEquals(gameOfLife(board), output);
    }
}
