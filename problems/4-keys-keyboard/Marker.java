import java.util.*;
class Marker {
    public int maxA(int n) {
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            dp[i] = dp[i - 1] + 1;
            for (int j = 1; j <= i - 3; j++) {
                dp[i] = Math.max(dp[i], dp[j] * (i - j - 1));
            }
        }
        return dp[n];
    }
    public boolean isCorrect(int n, int output) {
        return maxA(n) == output;
    }
}
