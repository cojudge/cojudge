import java.util.*;

class Marker {
    public boolean canPartitionKSubsets(int[] nums, int k) {
        int total = 0;
        for (int n : nums) total += n;
        if (total % k != 0) return false;
        int target = total / k;
        int n = nums.length;
        int[] sumRemaining = new int[1 << n];
        Arrays.fill(sumRemaining, -1);
        return partition(nums, 0, 0, target, sumRemaining);
    }

    private boolean partition(int[] nums, int mask, int currentSum, int target, int[] sumRemaining) {
        if (mask == (1 << nums.length) - 1) {
            return true;
        }
        if (sumRemaining[mask] != -1) {
            return false;
        }
        for (int i = 0; i < nums.length; i++) {
            if ((mask & (1 << i)) != 0) continue;
            int nextSum = currentSum + nums[i];
            if (nextSum > target) continue;
            if (partition(nums, mask | (1 << i), nextSum == target ? 0 : nextSum,
                    target, sumRemaining)) {
                return true;
            }
        }
        sumRemaining[mask] = 0;
        return false;
    }

    public boolean isCorrect(int[] nums, int k, boolean output) {
        return canPartitionKSubsets(nums, k) == output;
    }
}