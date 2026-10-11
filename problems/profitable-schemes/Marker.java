class Marker {
    static final int MOD = 1000000007;
    public int profitableSchemes(int n, int minProfit, int[] group, int[] profit) {
        int[][] dp = new int[n + 1][minProfit + 1];
        dp[0][0] = 1;
        for (int i = 0; i < group.length; i++) {
            int g = group[i], p = profit[i];
            for (int j = n; j >= g; j--) {
                for (int k = minProfit; k >= 0; k--) {
                    int nk = Math.min(minProfit, k + p);
                    dp[j][nk] = (dp[j][nk] + dp[j - g][k]) % MOD;
                }
            }
        }
        int ans = 0;
        for (int j = 0; j <= n; j++) ans = (ans + dp[j][minProfit]) % MOD;
        return ans;
    }
    public boolean isCorrect(int n, int minProfit, int[] group, int[] profit, int output) {
        return profitableSchemes(n, minProfit, group, profit) == output;
    }
}
