import java.util.*;
class Marker {
    public int smallestDistancePair(int[] nums, int k) {
        Arrays.sort(nums);
        int n = nums.length;
        int lo = 0, hi = nums[n-1] - nums[0];
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (countPairs(nums, mid) >= k) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
    private int countPairs(int[] nums, int limit) {
        int cnt = 0, left = 0;
        for (int right = 0; right < nums.length; right++) {
            while (nums[right] - nums[left] > limit) left++;
            cnt += right - left;
        }
        return cnt;
    }
    public boolean isCorrect(int[] nums, int k, int output) {
        return smallestDistancePair(nums.clone(), k) == output;
    }
}
