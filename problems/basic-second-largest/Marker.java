import java.util.*;
class Marker {
    public int secondLargest(int[] nums) {
        int max = nums[0];
        for (int x : nums) if (x > max) max = x;
        int second = Integer.MIN_VALUE;
        for (int x : nums) {
            if (x < max && x > second) second = x;
        }
        return second;
    }
    public boolean isCorrect(int[] nums, int output) {
        return secondLargest(nums) == output;
    }
}
