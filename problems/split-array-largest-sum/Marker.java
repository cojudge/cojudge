import java.util.*;
class Marker {
    public int splitArray(int[] nums, int k) {
        long lo = 0, hi = 0;
        for (int x : nums) { lo = Math.max(lo, x); hi += x; }
        while (lo < hi) {
            long mid = lo + (hi - lo) / 2;
            if (can(nums, k, mid)) hi = mid;
            else lo = mid + 1;
        }
        return (int) lo;
    }
    private boolean can(int[] nums, int k, long limit) {
        int parts = 1;
        long cur = 0;
        for (int x : nums) {
            if (cur + x > limit) { parts++; cur = 0; }
            cur += x;
            if (parts > k) return false;
        }
        return true;
    }
    public boolean isCorrect(int[] nums, int k, int output) {
        return splitArray(nums, k) == output;
    }
}
