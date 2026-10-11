import java.util.*;
class Marker {
    public int findMaxForm(String[] strs, int m, int n) {
        int[][] dp = new int[m + 1][n + 1];
        for (String s : strs) {
            int zeros = 0, ones = 0;
            for (int i = 0; i < s.length(); i++) {
                if (s.charAt(i) == '0') zeros++;
                else ones++;
            }
            for (int i = m; i >= zeros; i--) {
                for (int j = n; j >= ones; j--) {
                    dp[i][j] = Math.max(dp[i][j], dp[i - zeros][j - ones] + 1);
                }
            }
        }
        return dp[m][n];
    }
    public boolean isCorrect(String[] strs, int m, int n, int output) {
        return findMaxForm(strs, m, n) == output;
    }
}
