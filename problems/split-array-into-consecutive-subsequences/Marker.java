import java.util.*;
class Marker {
    public boolean isPossible(int[] nums) {
        Map<Integer,Integer> freq = new HashMap<>();
        for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
        Map<Integer,Integer> need = new HashMap<>();
        for (int x : nums) {
            if (freq.getOrDefault(x, 0) == 0) continue;
            if (need.getOrDefault(x, 0) > 0) {
                need.put(x, need.get(x) - 1);
                freq.put(x, freq.get(x) - 1);
                need.put(x + 1, need.getOrDefault(x + 1, 0) + 1);
            } else {
                if (freq.getOrDefault(x + 1, 0) == 0 || freq.getOrDefault(x + 2, 0) == 0) return false;
                freq.put(x, freq.get(x) - 1);
                freq.put(x + 1, freq.get(x + 1) - 1);
                freq.put(x + 2, freq.get(x + 2) - 1);
                need.put(x + 3, need.getOrDefault(x + 3, 0) + 1);
            }
        }
        return true;
    }
    public boolean isCorrect(int[] nums, boolean output) {
        return output == isPossible(nums.clone());
    }
}
