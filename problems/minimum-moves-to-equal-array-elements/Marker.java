import java.util.*;
class Marker {
    public int minMoves(int[] nums) {
        int min = Integer.MAX_VALUE;
        long sum = 0;
        for (int x : nums) {
            min = Math.min(min, x);
            sum += x;
        }
        return (int)(sum - (long) min * nums.length);
    }
    public boolean isCorrect(int[] nums, int output) {
        return minMoves(nums) == output;
    }
}
