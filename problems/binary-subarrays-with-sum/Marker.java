import java.util.*;
class Marker {
    public int numSubarraysWithSum(int[] nums, int goal) {
        Map<Integer,Integer> freq = new HashMap<>();
        freq.put(0, 1);
        int sum = 0, ans = 0;
        for (int v : nums) {
            sum += v;
            ans += freq.getOrDefault(sum - goal, 0);
            freq.put(sum, freq.getOrDefault(sum, 0) + 1);
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int goal, int output) {
        return numSubarraysWithSum(nums, goal) == output;
    }
}
