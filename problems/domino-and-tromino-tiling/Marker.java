import java.util.*;
class Marker {
    public int numTilings(int n) {
        final long MOD = 1000000007L;
        if (n == 0) return 1;
        if (n == 1) return 1;
        if (n == 2) return 2;
        long[] dp = new long[n + 1];
        dp[0] = 1;
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = (2 * dp[i - 1] + dp[i - 3]) % MOD;
        }
        return (int) dp[n];
    }
    public boolean isCorrect(int n, int output) {
        return numTilings(n) == output;
    }
}
