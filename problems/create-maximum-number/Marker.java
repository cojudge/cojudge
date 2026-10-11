import java.util.*;
class Marker {
    public int[] maxNumber(int[] nums1, int[] nums2, int k) {
        int m = nums1.length, n = nums2.length;
        int[] best = new int[0];
        for (int i = Math.max(0, k - n); i <= Math.min(k, m); i++) {
            int[] a = maxSubseq(nums1, i);
            int[] b = maxSubseq(nums2, k - i);
            int[] cand = merge(a, b);
            if (greater(cand, 0, best, 0)) best = cand;
        }
        return best;
    }

    private int[] maxSubseq(int[] nums, int t) {
        int[] st = new int[t];
        int len = 0, drop = nums.length - t;
        for (int v : nums) {
            while (len > 0 && drop > 0 && st[len - 1] < v) { len--; drop--; }
            if (len < t) st[len++] = v;
            else drop--;
        }
        return st;
    }

    private int[] merge(int[] a, int[] b) {
        int[] res = new int[a.length + b.length];
        int i = 0, j = 0, p = 0;
        while (i < a.length || j < b.length) {
            if (greater(a, i, b, j)) res[p++] = a[i++];
            else res[p++] = b[j++];
        }
        return res;
    }

    private boolean greater(int[] a, int i, int[] b, int j) {
        while (i < a.length && j < b.length && a[i] == b[j]) { i++; j++; }
        if (j == b.length) return true;
        if (i == a.length) return false;
        return a[i] > b[j];
    }

    public boolean isCorrect(int[] nums1, int[] nums2, int k, int[] output) {
        return Arrays.equals(maxNumber(nums1, nums2, k), output);
    }
}
