import java.util.*;
class Marker {
    public int[] sortArrayByParity(int[] nums) {
        int[] res = new int[nums.length];
        int p = 0;
        for (int x : nums) if (x % 2 == 0) res[p++] = x;
        for (int x : nums) if (x % 2 == 1) res[p++] = x;
        return res;
    }
    public boolean isCorrect(int[] nums, int[] output) {
        if (output == null || output.length != nums.length) return false;
        int[] a = nums.clone();
        int[] b = output.clone();
        Arrays.sort(a);
        Arrays.sort(b);
        if (!Arrays.equals(a, b)) return false;
        boolean seenOdd = false;
        for (int x : output) {
            if (x % 2 == 1) seenOdd = true;
            else if (seenOdd) return false;
        }
        return true;
    }
}
