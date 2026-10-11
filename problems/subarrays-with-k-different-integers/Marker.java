import java.util.*;
class Marker {
    public int subarraysWithKDistinct(int[] nums, int k) {
        return atMost(nums, k) - atMost(nums, k - 1);
    }
    private int atMost(int[] nums, int k) {
        if (k < 0) {
            return 0;
        }
        Map<Integer, Integer> count = new HashMap<>();
        int left = 0;
        int ans = 0;
        for (int right = 0; right < nums.length; right++) {
            count.put(nums[right], count.getOrDefault(nums[right], 0) + 1);
            while (count.size() > k) {
                int c = count.get(nums[left]) - 1;
                if (c == 0) {
                    count.remove(nums[left]);
                } else {
                    count.put(nums[left], c);
                }
                left++;
            }
            ans += right - left + 1;
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int k, int output) {
        return subarraysWithKDistinct(nums, k) == output;
    }
}
