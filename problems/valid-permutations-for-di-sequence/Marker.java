import java.util.*;
class Marker {
    public int numPermsDISequence(String s) {
        int n = s.length();
        int MOD = 1000000007;
        long[] dp = new long[n + 1];
        Arrays.fill(dp, 1);
        for (int i = 0; i < n; i++) {
            long[] ndp = new long[n + 1];
            if (s.charAt(i) == 'I') {
                long[] pre = new long[i + 2];
                for (int j = 0; j <= i; j++) pre[j + 1] = (pre[j] + dp[j]) % MOD;
                for (int j = 0; j <= i + 1; j++) ndp[j] = pre[j];
            } else {
                long[] suf = new long[i + 3];
                for (int j = i; j >= 0; j--) suf[j] = (suf[j + 1] + dp[j]) % MOD;
                for (int j = 0; j <= i + 1; j++) ndp[j] = suf[j];
            }
            dp = ndp;
        }
        long ans = 0;
        for (long v : dp) ans = (ans + v) % MOD;
        return (int) ans;
    }
    public boolean isCorrect(String s, int output) {
        return numPermsDISequence(s) == output;
    }
}
