import java.util.*;
class Marker {
    public int[] merge(int[] nums1, int m, int[] nums2, int n) {
        int[] a = nums1 == null ? new int[0] : Arrays.copyOf(nums1, Math.max(0, m));
        int[] b = nums2 == null ? new int[0] : Arrays.copyOf(nums2, Math.max(0, n));
        int[] res = new int[m + n];
        int i = 0, j = 0, k = 0;
        while (i < m && j < n) {
            if (a[i] <= b[j]) res[k++] = a[i++];
            else res[k++] = b[j++];
        }
        while (i < m) res[k++] = a[i++];
        while (j < n) res[k++] = b[j++];
        return res;
    }
    public boolean isCorrect(int[] nums1, int m, int[] nums2, int n, int[] output) {
        return Arrays.equals(merge(nums1, m, nums2, n), output);
    }
}
