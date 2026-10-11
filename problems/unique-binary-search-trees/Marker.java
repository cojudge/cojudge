class Marker {
    public int numTrees(int n) {
        long[] dp = new long[n + 1];
        dp[0] = 1;
        if (n >= 1) dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            dp[i] = 0;
            for (int r = 1; r <= i; r++) {
                dp[i] += dp[r - 1] * dp[i - r];
            }
        }
        return (int) dp[n];
    }
    public boolean isCorrect(int n, int output) {
        return output == numTrees(n);
    }
}
