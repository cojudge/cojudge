class Marker {
    public int getMoneyAmount(int n) {
        if (n <= 1) return 0;
        int[][] dp = new int[n + 2][n + 2];
        for (int len = 2; len <= n; len++) {
            for (int lo = 1; lo + len - 1 <= n; lo++) {
                int hi = lo + len - 1;
                int best = Integer.MAX_VALUE;
                for (int x = lo; x <= hi; x++) {
                    int left = (x - 1 >= lo) ? dp[lo][x - 1] : 0;
                    int right = (x + 1 <= hi) ? dp[x + 1][hi] : 0;
                    int cost = x + Math.max(left, right);
                    if (cost < best) best = cost;
                }
                dp[lo][hi] = best;
            }
        }
        return dp[1][n];
    }
    public boolean isCorrect(int n, int output) {
        return output == getMoneyAmount(n);
    }
}
