import java.util.*;
class Marker {
    public int avgFloor(int[] nums) {
        int total = 0;
        for (int x : nums) total += x;
        return total / nums.length;
    }
    public boolean isCorrect(int[] nums, int output) {
        return avgFloor(nums) == output;
    }
}
