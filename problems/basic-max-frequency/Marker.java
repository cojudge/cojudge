import java.util.*;
class Marker {
    public int maxFrequency(int[] nums) {
        int best = 1;
        for (int i = 0; i < nums.length; i++) {
            int count = 0;
            for (int j = 0; j < nums.length; j++) {
                if (nums[j] == nums[i]) count++;
            }
            if (count > best) best = count;
        }
        return best;
    }
    public boolean isCorrect(int[] nums, int output) {
        return maxFrequency(nums) == output;
    }
}
