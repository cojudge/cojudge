class Marker {
    public int maxProfit(int[] prices) {
        int n = prices.length;
        int minSoFar = prices[0];
        int ans = 0;
        for (int i = 1; i < n; i++) {
            ans = Math.max(ans, prices[i] - minSoFar);
            minSoFar = Math.min(minSoFar, prices[i]);
        }
        return ans;
    }
    public boolean isCorrect(int[] prices, int ans) {
        return maxProfit(prices) == ans;
    }
}
