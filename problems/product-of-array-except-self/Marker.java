import java.util.*;
class Marker {
    // Core solution: O(n) time, O(1) extra space (output array not counted)
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        if (n == 0) return new int[]{};
        int[] ans = new int[n];
        // prefix products
        ans[0] = 1;
        for (int i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];
        // suffix product accumulator
        int suf = 1;
        for (int i = n - 1; i >= 0; i--) {
            ans[i] = ans[i] * suf;
            suf *= nums[i];
        }
        return ans;
    }
    // Validation helper consistent with other problems
    public boolean isCorrect(int[] nums, int[] output) {
        return Arrays.equals(productExceptSelf(nums), output);
    }
}
