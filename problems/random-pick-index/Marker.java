import java.util.*;
class Marker {
    // Adaptation: the original is a Solution(nums) class with pick(target).
    // Here pick takes both array and target; any index holding target is
    // accepted since randomness cannot be checked deterministically.
    public int pick(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) return i;
        }
        return -1;
    }
    public boolean isCorrect(int[] nums, int target, int output) {
        return output >= 0 && output < nums.length && nums[output] == target;
    }
}
