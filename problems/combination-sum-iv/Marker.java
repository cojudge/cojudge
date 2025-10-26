class Marker {
    public int combinationSum4(int[] nums, int target) {
        int[] dp = new int[target + 1];
        dp[0] = 1;
        for (int t = 1; t <= target; t++) {
            long ways = 0;
            for (int x : nums) if (t - x >= 0) ways += dp[t - x];
            dp[t] = (int) ways; // Assume no overflow for test ranges
        }
        return dp[target];
    }
    public boolean isCorrect(int[] nums, int target, int output) { return combinationSum4(nums, target) == output; }
}
