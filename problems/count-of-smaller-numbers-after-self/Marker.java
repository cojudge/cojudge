import java.util.*;
class Marker {
    public int[] countSmaller(int[] nums) {
        int n = nums.length;
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        Map<Integer, Integer> rank = new HashMap<>();
        int r = 1;
        for (int v : sorted) {
            if (!rank.containsKey(v)) rank.put(v, r++);
        }
        int[] bit = new int[r + 1];
        int[] ans = new int[n];
        for (int i = n - 1; i >= 0; i--) {
            int k = rank.get(nums[i]) - 1;
            int s = 0;
            for (int j = k; j > 0; j -= j & -j) s += bit[j];
            ans[i] = s;
            int u = rank.get(nums[i]);
            for (int j = u; j < bit.length; j += j & -j) bit[j]++;
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int[] output) {
        return Arrays.equals(countSmaller(nums), output);
    }
}
