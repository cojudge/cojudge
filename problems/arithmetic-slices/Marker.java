import java.util.*;
class Marker {
    public int numberOfArithmeticSlices(int[] nums) {
        int n = nums.length;
        if (n < 3) return 0;
        int total = 0, cur = 0;
        for (int i = 2; i < n; i++) {
            if ((long)nums[i] - nums[i-1] == (long)nums[i-1] - nums[i-2]) {
                cur++;
                total += cur;
            } else {
                cur = 0;
            }
        }
        return total;
    }
    public boolean isCorrect(int[] nums, int output) {
        return numberOfArithmeticSlices(nums) == output;
    }
}
