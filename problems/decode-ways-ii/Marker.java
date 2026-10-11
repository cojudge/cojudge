import java.util.*;
class Marker {
    static final long MOD = 1000000007L;
    private long single(char c) {
        if (c == '*') return 9;
        if (c == '0') return 0;
        return 1;
    }
    private long pair(char a, char b) {
        if (a == '0') return 0;
        if (a == '1') return b == '*' ? 9 : 1;
        if (a == '2') {
            if (b == '*') return 6;
            return b <= '6' ? 1 : 0;
        }
        if (a == '*') {
            if (b == '*') return 15;
            return b <= '6' ? 2 : 1;
        }
        return 0;
    }
    public int numDecodings(String s) {
        int n = s.length();
        long[] dp = new long[n + 1];
        dp[0] = 1;
        dp[1] = single(s.charAt(0));
        for (int i = 2; i <= n; i++) {
            dp[i] = (dp[i - 1] * single(s.charAt(i - 1)) + dp[i - 2] * pair(s.charAt(i - 2), s.charAt(i - 1))) % MOD;
        }
        return (int) dp[n];
    }
    public boolean isCorrect(String s, int output) {
        return numDecodings(s) == output;
    }
}
