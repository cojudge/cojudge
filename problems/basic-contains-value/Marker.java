import java.util.*;
class Marker {
    public boolean containsValue(int[] nums, int target) {
        for (int x : nums) {
            if (x == target) return true;
        }
        return false;
    }
    public boolean isCorrect(int[] nums, int target, boolean output) {
        return containsValue(nums, target) == output;
    }
}
