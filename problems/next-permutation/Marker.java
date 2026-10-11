import java.util.*;
class Marker {
    public int[] nextPermutation(int[] nums) {
        int[] a = nums.clone();
        int i = a.length - 2;
        while (i >= 0 && a[i] >= a[i + 1]) i--;
        if (i >= 0) {
            int j = a.length - 1;
            while (a[j] <= a[i]) j--;
            int t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
        for (int l = i + 1, r = a.length - 1; l < r; l++, r--) {
            int t = a[l];
            a[l] = a[r];
            a[r] = t;
        }
        return a;
    }
    public boolean isCorrect(int[] nums, int[] output) {
        return Arrays.equals(nextPermutation(nums), output);
    }
}
