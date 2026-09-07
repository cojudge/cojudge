import java.util.*;
class Marker {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        freq.put(0, 1);
        int pref = 0, ans = 0;
        for (int x : nums) {
            pref += x;
            ans += freq.getOrDefault(pref - k, 0);
            freq.put(pref, freq.getOrDefault(pref, 0) + 1);
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int k, int output) {
        return subarraySum(nums, k) == output;
    }
}
