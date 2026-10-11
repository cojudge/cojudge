import java.util.*;
class Marker {
    public int[] wiggleSort(int[] nums) {
        int n = nums.length;
        int[] s = nums.clone();
        Arrays.sort(s);
        int[] res = new int[n];
        int mid = (n + 1) / 2;
        int i = mid - 1, j = n - 1, p = 0;
        while (p < n) {
            if (p < n) res[p++] = s[i--];
            if (p < n) res[p++] = s[j--];
        }
        return res;
    }
    public boolean isCorrect(int[] nums, int[] output) {
        if (output == null || output.length != nums.length) return false;
        int[] a = nums.clone();
        Arrays.sort(a);
        int[] b = output.clone();
        Arrays.sort(b);
        if (!Arrays.equals(a, b)) return false;
        for (int k = 0; k + 1 < output.length; k++) {
            if (k % 2 == 0) { if (!(output[k] < output[k + 1])) return false; }
            else { if (!(output[k] > output[k + 1])) return false; }
        }
        return true;
    }
}
