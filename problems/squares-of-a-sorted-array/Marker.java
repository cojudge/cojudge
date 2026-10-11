import java.util.*;
class Marker {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        int lo = 0;
        int hi = n - 1;
        for (int p = n - 1; p >= 0; p--) {
            int lq = nums[lo] * nums[lo];
            int hq = nums[hi] * nums[hi];
            if (lq > hq) { ans[p] = lq; lo++; }
            else { ans[p] = hq; hi--; }
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int[] output) {
        return Arrays.equals(sortedSquares(nums), output);
    }
}
