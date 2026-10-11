import java.util.*;
class Marker {
    public int maxKilledEnemies(char[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) return 0;
        int m = grid.length, n = grid[0].length;
        int[][] rh = new int[m][n], ch = new int[m][n];
        for (int i = 0; i < m; i++) {
            int j = 0;
            while (j < n) {
                if (grid[i][j] == 'W') { j++; continue; }
                int k = j, c = 0;
                while (k < n && grid[i][k] != 'W') { if (grid[i][k] == 'E') c++; k++; }
                for (int t = j; t < k; t++) rh[i][t] = c;
                j = k;
            }
        }
        for (int j = 0; j < n; j++) {
            int i = 0;
            while (i < m) {
                if (grid[i][j] == 'W') { i++; continue; }
                int k = i, c = 0;
                while (k < m && grid[k][j] != 'W') { if (grid[k][j] == 'E') c++; k++; }
                for (int t = i; t < k; t++) ch[t][j] = c;
                i = k;
            }
        }
        int best = 0;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (grid[i][j] == '0') best = Math.max(best, rh[i][j] + ch[i][j]);
        return best;
    }
    public boolean isCorrect(char[][] grid, int output) {
        return maxKilledEnemies(grid) == output;
    }
}
