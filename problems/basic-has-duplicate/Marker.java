import java.util.*;
class Marker {
    public boolean hasDuplicate(int[] nums) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] == nums[j]) return true;
            }
        }
        return false;
    }
    public boolean isCorrect(int[] nums, boolean output) {
        return hasDuplicate(nums) == output;
    }
}
