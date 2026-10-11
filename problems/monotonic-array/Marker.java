import java.util.*;
class Marker {
    public boolean isMonotonic(int[] nums) {
        boolean inc = true, dec = true;
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > nums[i - 1]) dec = false;
            if (nums[i] < nums[i - 1]) inc = false;
        }
        return inc || dec;
    }
    public boolean isCorrect(int[] nums, boolean output) {
        return isMonotonic(nums) == output;
    }
}
