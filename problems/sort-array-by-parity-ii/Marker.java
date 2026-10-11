import java.util.*;
class Marker {
    public int[] sortArrayByParityII(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        int e = 0, o = 1;
        for (int v : nums) {
            if (v % 2 == 0) { ans[e] = v; e += 2; }
            else { ans[o] = v; o += 2; }
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int[] output) {
        if (output == null || output.length != nums.length) return false;
        for (int i = 0; i < output.length; i++) {
            if (output[i] % 2 != i % 2) return false;
        }
        int[] a = nums.clone();
        int[] b = output.clone();
        Arrays.sort(a);
        Arrays.sort(b);
        return Arrays.equals(a, b);
    }
}
