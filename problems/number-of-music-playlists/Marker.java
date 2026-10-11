import java.util.*;
class Marker {
    public int numPlaylists(int n, int goal, int k) {
        long mod = 1000000007L;
        long[][] dp = new long[goal + 1][n + 1];
        dp[0][0] = 1;
        for (int i = 1; i <= goal; i++) {
            for (int j = 1; j <= Math.min(i, n); j++) {
                dp[i][j] = dp[i - 1][j - 1] * (n - j + 1) % mod;
                if (j > k) dp[i][j] = (dp[i][j] + dp[i - 1][j] * (j - k)) % mod;
            }
        }
        return (int) dp[goal][n];
    }
    public boolean isCorrect(int n, int goal, int k, int output) {
        return numPlaylists(n, goal, k) == output;
    }
}
