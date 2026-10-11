import java.util.*;
class Marker {
    public int[] wiggleSort(int[] nums) {
        int[] a = nums.clone();
        for (int i = 0; i + 1 < a.length; i++) {
            if ((i % 2 == 0 && a[i] > a[i + 1]) || (i % 2 == 1 && a[i] < a[i + 1])) {
                int t = a[i]; a[i] = a[i + 1]; a[i + 1] = t;
            }
        }
        return a;
    }
    public boolean isCorrect(int[] nums, int[] output) {
        if (output == null || output.length != nums.length) return false;
        int[] s1 = nums.clone(); Arrays.sort(s1);
        int[] s2 = output.clone(); Arrays.sort(s2);
        if (!Arrays.equals(s1, s2)) return false;
        for (int i = 0; i + 1 < output.length; i++) {
            if (i % 2 == 0) { if (output[i] > output[i + 1]) return false; }
            else { if (output[i] < output[i + 1]) return false; }
        }
        return true;
    }
}
