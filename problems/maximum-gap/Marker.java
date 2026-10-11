import java.util.*;
class Marker {
    public int maximumGap(int[] nums) {
        if (nums == null || nums.length < 2) return 0;
        Arrays.sort(nums);
        int best = 0;
        for (int i = 1; i < nums.length; i++) {
            best = Math.max(best, nums[i] - nums[i - 1]);
        }
        return best;
    }
    public boolean isCorrect(int[] nums, int output) {
        return maximumGap(nums.clone()) == output;
    }
}
