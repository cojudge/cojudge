import java.util.*;
class Marker {
    public int[] doubleArray(int[] nums) {
        int[] ans = new int[nums.length];
        for (int i = 0; i < nums.length; i++) ans[i] = nums[i] * 2;
        return ans;
    }
    public boolean isCorrect(int[] nums, int[] output) {
        return Arrays.equals(doubleArray(nums), output);
    }
}
