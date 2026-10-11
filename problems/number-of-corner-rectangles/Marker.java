import java.util.*;
class Marker {
    public int countCornerRectangles(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int ans = 0;
        Map<Long, Integer> cnt = new HashMap<>();
        for (int r = 0; r < m; r++) {
            for (int i = 0; i < n; i++) if (grid[r][i] == 1) {
                for (int j = i + 1; j < n; j++) if (grid[r][j] == 1) {
                    long key = ((long) i << 32) | (long) j;
                    ans += cnt.getOrDefault(key, 0);
                    cnt.put(key, cnt.getOrDefault(key, 0) + 1);
                }
            }
        }
        return ans;
    }
    public boolean isCorrect(int[][] grid, int output) {
        int[][] copy = new int[grid.length][];
        for (int i = 0; i < grid.length; i++) copy[i] = grid[i].clone();
        return countCornerRectangles(copy) == output;
    }
}
