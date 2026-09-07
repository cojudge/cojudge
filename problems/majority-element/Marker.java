import java.util.*;
class Marker {
    public int majorityElement(int[] nums) {
        int cand = nums[0], cnt = 0;
        for (int x : nums) {
            if (cnt == 0) { cand = x; cnt = 1; }
            else if (x == cand) cnt++;
            else cnt--;
        }
        return cand;
    }
    public boolean isCorrect(int[] nums, int output) {
        return majorityElement(nums) == output;
    }
}
