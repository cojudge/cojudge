import java.util.*;
class Marker {
    public int countAbove(int[] nums, int t) {
        int count = 0;
        for (int x : nums) {
            if (x > t) count++;
        }
        return count;
    }
    public boolean isCorrect(int[] nums, int t, int output) {
        return countAbove(nums, t) == output;
    }
}
