import java.util.*;
class Marker {
    public int surfaceArea(int[][] grid) {
        int n = grid.length;
        int ans = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < grid[i].length; j++) {
                int v = grid[i][j];
                if (v > 0) ans += 4 * v + 2;
            }
        }
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < grid[i].length; j++) {
                if (j + 1 < grid[i].length) ans -= 2 * Math.min(grid[i][j], grid[i][j + 1]);
                if (i + 1 < n && j < grid[i + 1].length) ans -= 2 * Math.min(grid[i][j], grid[i + 1][j]);
            }
        }
        return ans;
    }
    public boolean isCorrect(int[][] grid, int output) {
        return surfaceArea(grid) == output;
    }
}
