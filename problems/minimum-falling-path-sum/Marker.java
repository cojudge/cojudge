import java.util.*;
class Marker {
    public int minFallingPathSum(int[][] matrix) {
        int n = matrix.length;
        int[] prev = matrix[0].clone();
        for (int r = 1; r < n; r++) {
            int[] cur = new int[n];
            for (int c = 0; c < n; c++) {
                int best = prev[c];
                if (c > 0) best = Math.min(best, prev[c - 1]);
                if (c + 1 < n) best = Math.min(best, prev[c + 1]);
                cur[c] = matrix[r][c] + best;
            }
            prev = cur;
        }
        int ans = prev[0];
        for (int v : prev) ans = Math.min(ans, v);
        return ans;
    }
    public boolean isCorrect(int[][] matrix, int output) {
        return minFallingPathSum(matrix) == output;
    }
}
