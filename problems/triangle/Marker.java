import java.util.*;
class Marker {
    public int minimumTotal(int[][] triangle) {
        int n = triangle.length;
        int[] dp = new int[n + 1];
        for (int i = n - 1; i >= 0; i--) {
            for (int j = 0; j <= i; j++) {
                dp[j] = triangle[i][j] + Math.min(dp[j], dp[j + 1]);
            }
        }
        return dp[0];
    }
    public boolean isCorrect(int[][] triangle, int output) {
        return minimumTotal(triangle) == output;
    }
}
