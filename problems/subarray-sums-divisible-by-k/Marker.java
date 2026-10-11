import java.util.*;
class Marker {
    public int subarraysDivByK(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        freq.put(0, 1);
        int pref = 0;
        int ans = 0;
        for (int x : nums) {
            pref = ((pref + x) % k + k) % k;
            ans += freq.getOrDefault(pref, 0);
            freq.put(pref, freq.getOrDefault(pref, 0) + 1);
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int k, int output) {
        return subarraysDivByK(nums, k) == output;
    }
}
