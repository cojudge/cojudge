import java.util.*;
class Marker {
    public int smallestRangeII(int[] nums, int k) {
        int[] a = nums.clone();
        Arrays.sort(a);
        int n = a.length;
        int ans = a[n - 1] - a[0];
        for (int i = 1; i < n; i++) {
            int hi = Math.max(a[i - 1] + k, a[n - 1] - k);
            int lo = Math.min(a[0] + k, a[i] - k);
            ans = Math.min(ans, hi - lo);
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int k, int output) {
        return smallestRangeII(nums, k) == output;
    }
}
