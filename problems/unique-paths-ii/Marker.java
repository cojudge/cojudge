import java.util.*;
class Marker {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        int m = obstacleGrid.length, n = obstacleGrid[0].length;
        if (obstacleGrid[0][0] == 1) return 0;
        long[][] dp = new long[m][n];
        dp[0][0] = 1;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (i == 0 && j == 0) continue;
                if (obstacleGrid[i][j] == 1) {
                    dp[i][j] = 0;
                } else {
                    long up = i > 0 ? dp[i - 1][j] : 0;
                    long left = j > 0 ? dp[i][j - 1] : 0;
                    dp[i][j] = up + left;
                }
            }
        }
        return (int) dp[m - 1][n - 1];
    }
    public boolean isCorrect(int[][] obstacleGrid, int output) {
        return uniquePathsWithObstacles(obstacleGrid) == output;
    }
}