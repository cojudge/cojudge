import java.util.*;
class Marker {
    public int[] searchRange(int[] nums, int target) {
        return new int[]{bound(nums, target, true), bound(nums, target, false)};
    }
    private int bound(int[] a, int t, boolean first) {
        int lo = 0, hi = a.length - 1, ans = -1;
        while (lo <= hi) {
            int m = lo + (hi - lo) / 2;
            if (a[m] == t) {
                ans = m;
                if (first) hi = m - 1;
                else lo = m + 1;
            } else if (a[m] < t) lo = m + 1;
            else hi = m - 1;
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int target, int[] output) {
        return Arrays.equals(searchRange(nums, target), output);
    }
}
