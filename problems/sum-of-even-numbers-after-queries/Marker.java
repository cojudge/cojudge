import java.util.*;
class Marker {
    public int[] sumEvenAfterQueries(int[] nums, int[][] queries) {
        int even = 0;
        for (int x : nums) if (x % 2 == 0) even += x;
        int[] ans = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            int val = queries[i][0];
            int idx = queries[i][1];
            if (nums[idx] % 2 == 0) even -= nums[idx];
            nums[idx] += val;
            if (nums[idx] % 2 == 0) even += nums[idx];
            ans[i] = even;
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int[][] queries, int[] output) {
        return Arrays.equals(sumEvenAfterQueries(nums.clone(), queries), output);
    }
}
