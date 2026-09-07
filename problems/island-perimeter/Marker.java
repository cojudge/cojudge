import java.util.*;
class Marker {
    public int islandPerimeter(int[][] grid) {
        int rows = grid.length, cols = grid[0].length, peri = 0;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (grid[i][j] == 0) continue;
                peri += 4;
                if (i > 0 && grid[i-1][j] == 1) peri -= 2;
                if (j > 0 && grid[i][j-1] == 1) peri -= 2;
            }
        }
        return peri;
    }
    public boolean isCorrect(int[][] grid, int output) {
        return islandPerimeter(grid) == output;
    }
}
