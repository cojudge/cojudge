import java.util.*;
class Marker {
    public int minMoves2(int[] nums) {
        Arrays.sort(nums);
        int med = nums[nums.length / 2];
        long moves = 0;
        for (int v : nums) moves += Math.abs((long) v - med);
        return (int) moves;
    }
    public boolean isCorrect(int[] nums, int output) {
        return minMoves2(nums) == output;
    }
}
