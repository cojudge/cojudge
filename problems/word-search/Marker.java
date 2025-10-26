import java.util.*;
class Marker {
    public boolean exist(char[][] board, String word) {
        int m = board.length;
        int n = board[0].length;
        boolean[][] visited = new boolean[m][n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (dfs(board, word, 0, i, j, visited)) return true;
            }
        }
        return false;
    }

    private boolean dfs(char[][] b, String w, int k, int i, int j, boolean[][] vis) {
        if (k == w.length()) return true;
        if (i < 0 || i >= b.length || j < 0 || j >= b[0].length) return false;
        if (vis[i][j] || b[i][j] != w.charAt(k)) return false;
        vis[i][j] = true;
        boolean found = dfs(b, w, k + 1, i + 1, j, vis)
            || dfs(b, w, k + 1, i - 1, j, vis)
            || dfs(b, w, k + 1, i, j + 1, vis)
            || dfs(b, w, k + 1, i, j - 1, vis);
        vis[i][j] = false;
        return found;
    }

    public boolean isCorrect(char[][] board, String word, boolean output) {
        return exist(board, word) == output;
    }
}
