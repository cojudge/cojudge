import java.util.*;
class Marker {
    // Dynamic programming tracking current max and min products
    public int maxProduct(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        int curMax = nums[0], curMin = nums[0], ans = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int x = nums[i];
            if (x < 0) { // swap when negative flips signs
                int tmp = curMax; curMax = curMin; curMin = tmp;
            }
            curMax = Math.max(x, curMax * x);
            curMin = Math.min(x, curMin * x);
            ans = Math.max(ans, curMax);
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int output) {
        return maxProduct(nums) == output;
    }
}
