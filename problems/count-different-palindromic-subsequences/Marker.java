import java.util.*;
class Marker {
    static final int MOD = 1000000007;
    public int countPalindromicSubsequences(String s) {
        int n = s.length();
        long[][] dp = new long[n][n];
        for (int i = 0; i < n; i++) dp[i][i] = 1;
        for (int len = 2; len <= n; len++) {
            for (int l = 0; l + len - 1 < n; l++) {
                int r = l + len - 1;
                if (s.charAt(l) == s.charAt(r)) {
                    int low = l + 1, high = r - 1;
                    while (low <= high && s.charAt(low) != s.charAt(l)) low++;
                    while (low <= high && s.charAt(high) != s.charAt(l)) high--;
                    if (low > high) dp[l][r] = dp[l+1][r-1] * 2 + 2;
                    else if (low == high) dp[l][r] = dp[l+1][r-1] * 2 + 1;
                    else dp[l][r] = dp[l+1][r-1] * 2 - dp[low+1][high-1];
                } else {
                    dp[l][r] = dp[l+1][r] + dp[l][r-1] - dp[l+1][r-1];
                }
                dp[l][r] %= MOD;
                if (dp[l][r] < 0) dp[l][r] += MOD;
            }
        }
        return (int)(dp[0][n-1] % MOD);
    }
    public boolean isCorrect(String s, int output) {
        return countPalindromicSubsequences(s) == output;
    }
}
