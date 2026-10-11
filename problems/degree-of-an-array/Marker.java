import java.util.*;
class Marker {
    public int findShortestSubArray(int[] nums) {
        Map<Integer, Integer> count = new HashMap<>();
        Map<Integer, Integer> first = new HashMap<>();
        Map<Integer, Integer> last = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int v = nums[i];
            count.put(v, count.getOrDefault(v, 0) + 1);
            first.putIfAbsent(v, i);
            last.put(v, i);
        }
        int degree = 0;
        for (int c : count.values()) degree = Math.max(degree, c);
        int ans = nums.length;
        for (int v : count.keySet()) {
            if (count.get(v) == degree) {
                ans = Math.min(ans, last.get(v) - first.get(v) + 1);
            }
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int output) {
        return findShortestSubArray(nums.clone()) == output;
    }
}
