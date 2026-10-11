import java.util.*;
class Marker {
    public int findUnsortedSubarray(int[] nums) {
        int[] s = nums.clone();
        Arrays.sort(s);
        int l = nums.length, r = -1;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != s[i]) {
                l = Math.min(l, i);
                r = Math.max(r, i);
            }
        }
        return r == -1 ? 0 : r - l + 1;
    }
    public boolean isCorrect(int[] nums, int output) {
        return output == findUnsortedSubarray(nums);
    }
}
