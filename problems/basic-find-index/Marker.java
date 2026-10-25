import java.util.*;
class Marker {
    public int findIndex(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) return i;
        }
        return -1;
    }
    public boolean isCorrect(int[] nums, int target, int output) {
        return findIndex(nums, target) == output;
    }
}
