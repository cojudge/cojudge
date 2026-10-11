import java.util.*;
class Marker {
    public int smallestRangeI(int[] nums, int k) {
        int mn = nums[0], mx = nums[0];
        for (int v : nums) { mn = Math.min(mn, v); mx = Math.max(mx, v); }
        return Math.max(0, mx - mn - 2 * k);
    }
    public boolean isCorrect(int[] nums, int k, int output) {
        return smallestRangeI(nums, k) == output;
    }
}
