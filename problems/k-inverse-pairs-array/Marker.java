import java.util.*;
class Marker {
    static final int MOD = 1000000007;
    public int kInversePairs(int n, int k) {
        int[] dp = new int[k + 1];
        dp[0] = 1;
        for (int i = 1; i <= n; i++) {
            int[] ndp = new int[k + 1];
            long window = 0;
            for (int j = 0; j <= k; j++) {
                window = (window + dp[j]) % MOD;
                if (j >= i) window = (window - dp[j - i] + MOD) % MOD;
                ndp[j] = (int) window;
            }
            dp = ndp;
        }
        return dp[k];
    }
    public boolean isCorrect(int n, int k, int output) {
        return kInversePairs(n, k) == output;
    }
}
