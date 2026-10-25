import java.util.*;
class Marker {
    public int arrayMin(int[] nums) {
        int best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] < best) best = nums[i];
        }
        return best;
    }
    public boolean isCorrect(int[] nums, int output) {
        return arrayMin(nums) == output;
    }
}
