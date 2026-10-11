import java.util.*;
class Marker {
    public int pivotIndex(int[] nums) {
        int total = 0;
        for (int v : nums) total += v;
        int left = 0;
        for (int i = 0; i < nums.length; i++) {
            if (left == total - left - nums[i]) return i;
            left += nums[i];
        }
        return -1;
    }
    public boolean isCorrect(int[] nums, int output) {
        return pivotIndex(nums) == output;
    }
}
