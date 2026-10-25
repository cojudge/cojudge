import java.util.*;
class Marker {
    public int arraySumRec(int[] nums) {
        return sumHelper(nums, 0);
    }
    private int sumHelper(int[] nums, int i) {
        if (i >= nums.length) return 0;
        return nums[i] + sumHelper(nums, i + 1);
    }
    public boolean isCorrect(int[] nums, int output) {
        return arraySumRec(nums) == output;
    }
}
