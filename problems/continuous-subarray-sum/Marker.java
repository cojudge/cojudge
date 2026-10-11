import java.util.*;
class Marker {
    public boolean checkSubarraySum(int[] nums, int k) {
        Map<Long, Integer> first = new HashMap<>();
        first.put(0L, -1);
        long sum = 0;
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i];
            long key = (k == 0) ? sum : ((sum % k) + k) % k;
            if (first.containsKey(key)) {
                if (i - first.get(key) >= 2) return true;
            } else {
                first.put(key, i);
            }
        }
        return false;
    }
    public boolean isCorrect(int[] nums, int k, boolean output) {
        return checkSubarraySum(nums, k) == output;
    }
}
