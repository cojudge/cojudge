import java.util.*;
class Marker {
    public int[] reverseArray(int[] nums) {
        int[] ans = new int[nums.length];
        for (int i = 0; i < nums.length; i++) ans[i] = nums[nums.length - 1 - i];
        return ans;
    }
    public boolean isCorrect(int[] nums, int[] output) {
        return Arrays.equals(reverseArray(nums), output);
    }
}
