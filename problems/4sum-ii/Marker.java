import java.util.*;
class Marker {
    public int fourSumCount(int[] nums1, int[] nums2, int[] nums3, int[] nums4) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int a : nums1) for (int b : nums2) map.put(a + b, map.getOrDefault(a + b, 0) + 1);
        int ans = 0;
        for (int c : nums3) for (int d : nums4) ans += map.getOrDefault(-(c + d), 0);
        return ans;
    }
    public boolean isCorrect(int[] nums1, int[] nums2, int[] nums3, int[] nums4, int output) {
        return fourSumCount(nums1, nums2, nums3, nums4) == output;
    }
}
