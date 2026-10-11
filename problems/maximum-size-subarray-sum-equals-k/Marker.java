import java.util.*;
class Marker {
    public int maxSubArrayLen(int[] nums, int k) {
        Map<Long, Integer> first = new HashMap<>();
        first.put(0L, -1);
        long prefix = 0;
        int best = 0;
        for (int i = 0; i < nums.length; i++) {
            prefix += nums[i];
            long want = prefix - k;
            if (first.containsKey(want)) {
                best = Math.max(best, i - first.get(want));
            }
            first.putIfAbsent(prefix, i);
        }
        return best;
    }
    public boolean isCorrect(int[] nums, int k, int output) {
        return maxSubArrayLen(nums, k) == output;
    }
}
