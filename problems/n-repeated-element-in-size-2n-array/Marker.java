import java.util.*;
class Marker {
    public int repeatedNTimes(int[] nums) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int v : nums) freq.put(v, freq.getOrDefault(v, 0) + 1);
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            if (e.getValue() > 1) return e.getKey();
        }
        return nums[0];
    }
    public boolean isCorrect(int[] nums, int output) {
        return output == repeatedNTimes(nums);
    }
}
