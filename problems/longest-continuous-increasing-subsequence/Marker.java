import java.util.*;
class Marker {
    public int findLengthOfLCIS(int[] nums) {
        if (nums.length == 0) return 0;
        int best = 1, cur = 1;
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > nums[i-1]) cur++;
            else cur = 1;
            best = Math.max(best, cur);
        }
        return best;
    }
    public boolean isCorrect(int[] nums, int output) {
        return findLengthOfLCIS(nums) == output;
    }
}
