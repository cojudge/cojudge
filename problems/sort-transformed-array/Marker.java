import java.util.*;
class Marker {
    public int[] sortTransformedArray(int[] nums, int a, int b, int c) {
        int n = nums == null ? 0 : nums.length;
        int[] out = new int[n];
        int l = 0, r = n - 1, idx = a >= 0 ? n - 1 : 0;
        while (l <= r) {
            int lv = a * nums[l] * nums[l] + b * nums[l] + c;
            int rv = a * nums[r] * nums[r] + b * nums[r] + c;
            if (a >= 0) {
                if (lv >= rv) { out[idx--] = lv; l++; }
                else { out[idx--] = rv; r--; }
            } else {
                if (lv <= rv) { out[idx++] = lv; l++; }
                else { out[idx++] = rv; r--; }
            }
        }
        return out;
    }
    public boolean isCorrect(int[] nums, int a, int b, int c, int[] output) {
        return Arrays.equals(sortTransformedArray(nums, a, b, c), output);
    }
}
