class Marker {
    public int minSubArrayLen(int target, int[] nums) {
        int n = nums.length;
        int best = Integer.MAX_VALUE;
        int left = 0;
        long sum = 0;
        for (int right = 0; right < n; right++) {
            sum += nums[right];
            while (sum >= target) {
                best = Math.min(best, right - left + 1);
                sum -= nums[left++];
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
    public boolean isCorrect(int target, int[] nums, int output) {
        return output == minSubArrayLen(target, nums);
    }
}
