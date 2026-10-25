import java.util.*;
class Marker {
    public int arraySum(int[] nums) {
        int total = 0;
        for (int x : nums) total += x;
        return total;
    }
    public boolean isCorrect(int[] nums, int output) {
        return arraySum(nums) == output;
    }
}
