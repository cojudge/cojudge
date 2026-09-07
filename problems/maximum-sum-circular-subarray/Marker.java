class Marker {
    public int maxSubarraySumCircular(int[] nums) {
        long total = 0;
        long maxEnd = 0;
        long maxSum = Long.MIN_VALUE;
        long minEnd = 0;
        long minSum = Long.MAX_VALUE;

        for (int x : nums) {
            total += x;
            maxEnd = Math.max(x, maxEnd + x);
            maxSum = Math.max(maxSum, maxEnd);
            minEnd = Math.min(x, minEnd + x);
            minSum = Math.min(minSum, minEnd);
        }

        if (maxSum < 0) {
            return (int) maxSum;
        }
        return (int) Math.max(maxSum, total - minSum);
    }

    public boolean isCorrect(int[] nums, int output) {
        return maxSubarraySumCircular(nums) == output;
    }
}