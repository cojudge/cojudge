import java.util.*;
class Marker {
    public int[] rotate(int[] nums, int k) {
        if (nums == null || nums.length == 0) return new int[0];
        int n = nums.length;
        k = ((k % n) + n) % n;
        int[] res = new int[n];
        for (int i = 0; i < n; i++) {
            res[(i + k) % n] = nums[i];
        }
        return res;
    }
    public boolean isCorrect(int[] nums, int k, int[] output) {
        return Arrays.equals(rotate(nums, k), output);
    }
}
