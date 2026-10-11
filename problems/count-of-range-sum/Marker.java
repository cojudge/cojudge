import java.util.*;
class Marker {
    public int countRangeSum(int[] nums, int lower, int upper) {
        int n = nums.length;
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
        return sortCount(prefix, 0, n + 1, lower, upper);
    }

    private int sortCount(long[] sums, int lo, int hi, int lower, int upper) {
        if (hi - lo <= 1) return 0;
        int mid = (lo + hi) / 2;
        int count = sortCount(sums, lo, mid, lower, upper)
                + sortCount(sums, mid, hi, lower, upper);
        int j = mid, k = mid;
        for (int i = lo; i < mid; i++) {
            while (k < hi && sums[k] - sums[i] < lower) k++;
            while (j < hi && sums[j] - sums[i] <= upper) j++;
            count += j - k;
        }
        long[] tmp = new long[hi - lo];
        int p = lo, q = mid, t = 0;
        while (p < mid && q < hi) tmp[t++] = sums[p] <= sums[q] ? sums[p++] : sums[q++];
        while (p < mid) tmp[t++] = sums[p++];
        while (q < hi) tmp[t++] = sums[q++];
        System.arraycopy(tmp, 0, sums, lo, tmp.length);
        return count;
    }

    public boolean isCorrect(int[] nums, int lower, int upper, int output) {
        return countRangeSum(nums, lower, upper) == output;
    }
}
