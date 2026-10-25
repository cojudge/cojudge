import java.util.*;
class Marker {
    public boolean isSorted(int[] nums) {
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] < nums[i - 1]) return false;
        }
        return true;
    }
    public boolean isCorrect(int[] nums, boolean output) {
        return isSorted(nums) == output;
    }
}
