import java.util.*;
class Marker {
    public int longestLine(int[][] mat) {
        int m = mat.length, n = mat[0].length, best = 0;
        int[][][] dp = new int[m][n][4];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (mat[i][j] == 0) continue;
                dp[i][j][0] = (j > 0 ? dp[i][j - 1][0] : 0) + 1;
                dp[i][j][1] = (i > 0 ? dp[i - 1][j][1] : 0) + 1;
                dp[i][j][2] = (i > 0 && j > 0 ? dp[i - 1][j - 1][2] : 0) + 1;
                dp[i][j][3] = (i > 0 && j + 1 < n ? dp[i - 1][j + 1][3] : 0) + 1;
                for (int k = 0; k < 4; k++) best = Math.max(best, dp[i][j][k]);
            }
        }
        return best;
    }
    public boolean isCorrect(int[][] mat, int output) {
        return output == longestLine(mat);
    }
}
