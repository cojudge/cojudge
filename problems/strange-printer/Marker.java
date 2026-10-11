import java.util.*;
class Marker {
    public int strangePrinter(String s) {
        if (s == null || s.length() == 0) return 0;
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (sb.length() == 0 || sb.charAt(sb.length()-1) != c) sb.append(c);
        }
        String t = sb.toString();
        int n = t.length();
        int[][] dp = new int[n][n];
        for (int i = 0; i < n; i++) dp[i][i] = 1;
        for (int len = 2; len <= n; len++) {
            for (int l = 0; l + len - 1 < n; l++) {
                int r = l + len - 1;
                dp[l][r] = dp[l][r-1] + 1;
                for (int k = l; k < r; k++) {
                    if (t.charAt(k) == t.charAt(r)) {
                        int v = dp[l][k] + (k + 1 <= r - 1 ? dp[k+1][r-1] : 0);
                        dp[l][r] = Math.min(dp[l][r], v);
                    }
                }
            }
        }
        return dp[0][n-1];
    }
    public boolean isCorrect(String s, int output) {
        return output == strangePrinter(s);
    }
}
