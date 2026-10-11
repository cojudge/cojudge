import java.util.*;
class Marker {
    public int orderOfLargestPlusSign(int n, int[][] mines) {
        boolean[][] banned = new boolean[n][n];
        for (int[] m : mines) banned[m[0]][m[1]] = true;
        int[][] left = new int[n][n], right = new int[n][n], up = new int[n][n], down = new int[n][n];
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                if (!banned[r][c]) left[r][c] = (c > 0 ? left[r][c - 1] : 0) + 1;
            }
        }
        for (int r = 0; r < n; r++) {
            for (int c = n - 1; c >= 0; c--) {
                if (!banned[r][c]) right[r][c] = (c + 1 < n ? right[r][c + 1] : 0) + 1;
            }
        }
        for (int c = 0; c < n; c++) {
            for (int r = 0; r < n; r++) {
                if (!banned[r][c]) up[r][c] = (r > 0 ? up[r - 1][c] : 0) + 1;
            }
            for (int r = n - 1; r >= 0; r--) {
                if (!banned[r][c]) down[r][c] = (r + 1 < n ? down[r + 1][c] : 0) + 1;
            }
        }
        int best = 0;
        for (int r = 0; r < n; r++)
            for (int c = 0; c < n; c++)
                if (!banned[r][c]) {
                    int k = Math.min(Math.min(left[r][c], right[r][c]), Math.min(up[r][c], down[r][c]));
                    best = Math.max(best, k);
                }
        return best;
    }
    public boolean isCorrect(int n, int[][] mines, int output) {
        return output == orderOfLargestPlusSign(n, mines);
    }
}
