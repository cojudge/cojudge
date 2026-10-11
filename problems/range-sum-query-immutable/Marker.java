import java.util.*;
class Marker {
    public int[] runNumArray(int[] nums, int[][] queries) {
        int[] pref = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) pref[i + 1] = pref[i] + nums[i];
        int[] ans = new int[queries.length];
        for (int q = 0; q < queries.length; q++) {
            ans[q] = pref[queries[q][1] + 1] - pref[queries[q][0]];
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int[][] queries, int[] output) {
        return Arrays.equals(runNumArray(nums, queries), output);
    }
}
