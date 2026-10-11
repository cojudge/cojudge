import java.util.*;
class Marker {
    public int[] largestDivisibleSubset(int[] nums) {
        if (nums == null || nums.length == 0) return new int[0];
        int[] s = nums.clone();
        Arrays.sort(s);
        int n = s.length;
        int[] dp = new int[n];
        int[] prev = new int[n];
        Arrays.fill(dp, 1);
        Arrays.fill(prev, -1);
        int best = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (s[i] % s[j] == 0 && dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;
                    prev[i] = j;
                }
            }
            if (dp[i] > dp[best]) best = i;
        }
        List<Integer> chain = new ArrayList<>();
        for (int i = best; i >= 0; i = prev[i]) {
            chain.add(s[i]);
            if (prev[i] == -1) break;
        }
        int[] ans = new int[chain.size()];
        for (int i = 0; i < ans.length; i++) ans[i] = chain.get(i);
        return ans;
    }
    public boolean isCorrect(int[] nums, int[] output) {
        if (output == null) return false;
        int[] expected = largestDivisibleSubset(nums);
        if (output.length != expected.length) return false;
        Set<Integer> pool = new HashSet<>();
        for (int v : nums) pool.add(v);
        for (int v : output) {
            if (!pool.contains(v)) return false;
            pool.remove(v);
        }
        int[] s = output.clone();
        Arrays.sort(s);
        for (int i = 0; i < s.length; i++) {
            for (int j = i + 1; j < s.length; j++) {
                if (s[j] % s[i] != 0) return false;
            }
        }
        return true;
    }
}
