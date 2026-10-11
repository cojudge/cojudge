import java.util.*;
class Marker {
    public int numSubarrayProductLessThanK(int[] nums, int k) {
        if (k <= 1) return 0;
        long prod = 1;
        int left = 0, ans = 0;
        for (int right = 0; right < nums.length; right++) {
            prod *= nums[right];
            while (prod >= k) {
                prod /= nums[left];
                left++;
            }
            ans += right - left + 1;
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int k, int output) {
        return numSubarrayProductLessThanK(nums, k) == output;
    }
}
