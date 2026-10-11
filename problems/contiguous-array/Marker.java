import java.util.*;
class Marker {
    public int findMaxLength(int[] nums) {
        Map<Integer, Integer> first = new HashMap<>();
        first.put(0, -1);
        int best = 0, total = 0;
        for (int i = 0; i < nums.length; i++) {
            total += (nums[i] == 1) ? 1 : -1;
            if (first.containsKey(total)) {
                best = Math.max(best, i - first.get(total));
            } else {
                first.put(total, i);
            }
        }
        return best;
    }
    public boolean isCorrect(int[] nums, int output) {
        return findMaxLength(nums) == output;
    }
}
