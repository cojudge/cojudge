import java.util.*;
class Marker {
    public int[] maxSumOfThreeSubarrays(int[] nums, int k) {
        int n = nums.length;
        int m = n - k + 1;
        int[] w = new int[m];
        int sum = 0;
        for (int i = 0; i < k; i++) sum += nums[i];
        w[0] = sum;
        for (int i = 1; i < m; i++) {
            sum += nums[i + k - 1] - nums[i - 1];
            w[i] = sum;
        }
        int[] left = new int[m];
        int best = 0;
        for (int i = 0; i < m; i++) {
            if (w[i] > w[best]) best = i;
            left[i] = best;
        }
        int[] right = new int[m];
        best = m - 1;
        for (int i = m - 1; i >= 0; i--) {
            if (w[i] >= w[best]) best = i;
            right[i] = best;
        }
        int[] ans = new int[]{-1, -1, -1};
        int maxTotal = -1;
        for (int j = k; j <= m - 1 - k; j++) {
            int i = left[j - k];
            int l = right[j + k];
            int total = w[i] + w[j] + w[l];
            if (total > maxTotal || (total == maxTotal && lexSmaller(new int[]{i, j, l}, ans))) {
                maxTotal = total;
                ans = new int[]{i, j, l};
            }
        }
        return ans;
    }
    private boolean lexSmaller(int[] a, int[] b) {
        if (b[0] == -1) return true;
        for (int i = 0; i < 3; i++) {
            if (a[i] != b[i]) return a[i] < b[i];
        }
        return false;
    }
    private int windowSum(int[] nums, int start, int k) {
        int s = 0;
        for (int i = start; i < start + k; i++) s += nums[i];
        return s;
    }
    public boolean isCorrect(int[] nums, int k, int[] output) {
        if (output == null || output.length != 3) return false;
        int n = nums.length;
        for (int v : output) if (v < 0 || v + k > n) return false;
        if (!(output[0] < output[1] && output[1] < output[2])) return false;
        if (!(output[0] + k <= output[1] && output[1] + k <= output[2])) return false;
        int got = windowSum(nums, output[0], k) + windowSum(nums, output[1], k) + windowSum(nums, output[2], k);
        int[] exp = maxSumOfThreeSubarrays(nums.clone(), k);
        int want = windowSum(nums, exp[0], k) + windowSum(nums, exp[1], k) + windowSum(nums, exp[2], k);
        return got == want;
    }
}
