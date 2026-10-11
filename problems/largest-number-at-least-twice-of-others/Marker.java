import java.util.*;
class Marker {
    public int dominantIndex(int[] nums) {
        int mx = nums[0], idx = 0;
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > mx) { mx = nums[i]; idx = i; }
        }
        for (int i = 0; i < nums.length; i++) {
            if (i != idx && mx < 2 * nums[i]) return -1;
        }
        return idx;
    }
    public boolean isCorrect(int[] nums, int output) {
        return dominantIndex(nums.clone()) == output;
    }
}
