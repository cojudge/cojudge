import java.util.*;
class Marker {
    public int[] singleNumber(int[] nums) {
        int xor = 0;
        for (int v : nums) xor ^= v;
        int bit = xor & -xor;
        int a = 0, b = 0;
        for (int v : nums) {
            if ((v & bit) == 0) a ^= v;
            else b ^= v;
        }
        return new int[]{a, b};
    }
    public boolean isCorrect(int[] nums, int[] output) {
        if (output == null || output.length != 2) return false;
        int[] expected = singleNumber(nums.clone());
        Arrays.sort(expected);
        int[] actual = output.clone();
        Arrays.sort(actual);
        return Arrays.equals(expected, actual);
    }
}
