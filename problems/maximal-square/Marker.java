import java.util.*;
class Marker {
    public int maximalSquare(char[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) return 0;
        int rows = matrix.length, cols = matrix[0].length;
        int[] dp = new int[cols + 1];
        int best = 0, prev = 0;
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= cols; j++) {
                int tmp = dp[j];
                if (matrix[i - 1][j - 1] == '1') {
                    dp[j] = 1 + Math.min(Math.min(dp[j], dp[j - 1]), prev);
                    best = Math.max(best, dp[j]);
                } else {
                    dp[j] = 0;
                }
                prev = tmp;
            }
        }
        return best * best;
    }
    public boolean isCorrect(char[][] matrix, int output) {
        return output == maximalSquare(matrix);
    }
}
