import java.util.*;
class Marker {
    public int maxRotateFunction(int[] nums) {
        int n = nums.length;
        long total = 0, cur = 0;
        for (int i = 0; i < n; i++) {
            total += nums[i];
            cur += (long) i * nums[i];
        }
        long best = cur;
        for (int k = 1; k < n; k++) {
            cur = cur + total - (long) n * nums[n - k];
            if (cur > best) best = cur;
        }
        return (int) best;
    }
    public boolean isCorrect(int[] nums, int output) {
        return output == maxRotateFunction(nums);
    }
}
