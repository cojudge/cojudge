class Marker {
    public int maxCoins(int[] nums) {
        int n = nums.length;
        int[] balloons = new int[n + 2];
        balloons[0] = 1;
        balloons[n + 1] = 1;
        System.arraycopy(nums, 0, balloons, 1, n);

        long[][] dp = new long[n + 2][n + 2];
        for (int length = 1; length <= n; length++) {
            for (int left = 1; left + length - 1 <= n; left++) {
                int right = left + length - 1;
                for (int last = left; last <= right; last++) {
                    long coins = dp[left][last - 1] + dp[last + 1][right]
                            + (long) balloons[left - 1] * balloons[last] * balloons[right + 1];
                    dp[left][right] = Math.max(dp[left][right], coins);
                }
            }
        }
        return (int) dp[1][n];
    }

    public boolean isCorrect(int[] nums, int output) {
        return maxCoins(nums) == output;
    }
}
