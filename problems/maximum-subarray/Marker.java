import java.util.*;
class Marker {
    // Kadane's algorithm; returns 0 for empty input to keep behavior defined
    public int maxSubArray(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        int best = nums[0];
        int cur = nums[0];
        for (int i = 1; i < nums.length; i++) {
            cur = Math.max(nums[i], cur + nums[i]);
            best = Math.max(best, cur);
        }
        return best;
    }

    // Validation helper used by the judge
    public boolean isCorrect(int[] nums, int output) {
        return maxSubArray(nums) == output;
    }
}
