class Marker {
    public int longestPalindromeSubseq(String s) {
        int n = s.length();
        int[] dp = new int[n];
        for (int i = n - 1; i >= 0; i--) {
            dp[i] = 1;
            int prev = 0;
            for (int j = i + 1; j < n; j++) {
                int tmp = dp[j];
                if (s.charAt(i) == s.charAt(j)) dp[j] = prev + 2;
                else dp[j] = Math.max(dp[j], dp[j - 1]);
                prev = tmp;
            }
        }
        return dp[n - 1];
    }
    public boolean isCorrect(String s, int output) {
        return output == longestPalindromeSubseq(s);
    }
}
