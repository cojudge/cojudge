import java.util.*;
class Marker {
    public int findPairs(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int v : nums) freq.put(v, freq.getOrDefault(v, 0) + 1);
        int ans = 0;
        if (k == 0) {
            for (int c : freq.values()) {
                if (c >= 2) ans++;
            }
        } else {
            for (int v : freq.keySet()) {
                if (freq.containsKey(v + k)) ans++;
            }
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int k, int output) {
        return findPairs(nums, k) == output;
    }
}
