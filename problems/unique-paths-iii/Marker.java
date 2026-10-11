import java.util.*;
class Marker {
    private int rows;
    private int cols;
    private int total;
    private int ans;
    public int uniquePathsIII(int[][] grid) {
        rows = grid.length;
        cols = grid[0].length;
        total = 0;
        int sx = -1;
        int sy = -1;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (grid[i][j] != -1) total++;
                if (grid[i][j] == 1) { sx = i; sy = j; }
            }
        }
        ans = 0;
        int[][] g = new int[rows][];
        for (int i = 0; i < rows; i++) g[i] = grid[i].clone();
        dfs(g, sx, sy, 1);
        return ans;
    }
    private void dfs(int[][] g, int x, int y, int visited) {
        if (x < 0 || x >= rows || y < 0 || y >= cols || g[x][y] == -1) return;
        if (g[x][y] == 2) {
            if (visited == total) ans++;
            return;
        }
        int saved = g[x][y];
        g[x][y] = -1;
        dfs(g, x + 1, y, visited + 1);
        dfs(g, x - 1, y, visited + 1);
        dfs(g, x, y + 1, visited + 1);
        dfs(g, x, y - 1, visited + 1);
        g[x][y] = saved;
    }
    public boolean isCorrect(int[][] grid, int output) {
        return uniquePathsIII(grid) == output;
    }
}
