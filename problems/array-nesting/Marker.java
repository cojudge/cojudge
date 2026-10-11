import java.util.*;
class Marker {
    public int arrayNesting(int[] nums) {
        boolean[] seen = new boolean[nums.length];
        int best = 0;
        for (int i = 0; i < nums.length; i++) {
            if (seen[i]) continue;
            int cur = i, len = 0;
            while (!seen[cur]) {
                seen[cur] = true;
                cur = nums[cur];
                len++;
            }
            best = Math.max(best, len);
        }
        return best;
    }
    public boolean isCorrect(int[] nums, int output) {
        return output == arrayNesting(nums);
    }
}
