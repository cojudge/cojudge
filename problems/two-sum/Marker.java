import java.util.*;
class Marker {
    public int[] twoSum(int[] nums, int target) {
        int n = nums.length;
        Map<Integer, Integer> mp = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int want = target - nums[i];
            if (mp.containsKey(want)) return new int[] {i, mp.get(want)};
            mp.put(nums[i], i);
        }
        return new int[]{};
    }
    public boolean isCorrect(int[] nums, int target, int[] output) {
        if (output.length == 0) return twoSum(nums, target).length == 0;
        return nums[output[0]] + nums[output[1]] == target;
    }
}
