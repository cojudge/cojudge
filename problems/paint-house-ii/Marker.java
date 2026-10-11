class Marker {
    public int minCostII(int[][] costs) {
        if (costs == null || costs.length == 0) return 0;
        int n = costs.length, k = costs[0].length;
        if (k == 1) return n == 1 ? costs[0][0] : -1;
        int[] dp = costs[0].clone();
        for (int i = 1; i < n; i++) {
            int min1 = Integer.MAX_VALUE, min2 = Integer.MAX_VALUE, idx1 = -1;
            for (int j = 0; j < k; j++) {
                if (dp[j] < min1) {
                    min2 = min1;
                    min1 = dp[j];
                    idx1 = j;
                } else if (dp[j] < min2) {
                    min2 = dp[j];
                }
            }
            int[] next = new int[k];
            for (int j = 0; j < k; j++) {
                next[j] = costs[i][j] + (j == idx1 ? min2 : min1);
            }
            dp = next;
        }
        int ans = Integer.MAX_VALUE;
        for (int v : dp) ans = Math.min(ans, v);
        return ans;
    }
    public boolean isCorrect(int[][] costs, int output) {
        return minCostII(costs) == output;
    }
}
