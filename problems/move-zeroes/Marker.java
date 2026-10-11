import java.util.*;
class Marker {
    public int[] moveZeroes(int[] nums) {
        int[] a = nums.clone();
        int w = 0;
        for (int x : a) if (x != 0) a[w++] = x;
        while (w < a.length) a[w++] = 0;
        return a;
    }
    public boolean isCorrect(int[] nums, int[] output) {
        return Arrays.equals(moveZeroes(nums), output);
    }
}
