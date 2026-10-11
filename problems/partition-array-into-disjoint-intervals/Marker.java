import java.util.*;
class Marker {
    public int partitionDisjoint(int[] nums) {
        int n = nums.length;
        int[] suf = new int[n];
        suf[n - 1] = nums[n - 1];
        for (int i = n - 2; i >= 0; i--) suf[i] = Math.min(suf[i + 1], nums[i]);
        int pre = nums[0];
        for (int i = 0; i < n - 1; i++) {
            pre = Math.max(pre, nums[i]);
            if (pre <= suf[i + 1]) return i + 1;
        }
        return n;
    }
    public boolean isCorrect(int[] nums, int output) {
        return partitionDisjoint(nums) == output;
    }
}
