import java.util.*;
class Marker {
    private Map<Integer, Integer> memo = new HashMap<>();
    public int racecar(int target) {
        memo.clear();
        return dfs(target);
    }
    private int dfs(int t) {
        if (t == 0) return 0;
        if (memo.containsKey(t)) return memo.get(t);
        int n = 1;
        while ((1 << n) - 1 < t) n++;
        if ((1 << n) - 1 == t) { memo.put(t, n); return n; }
        int ans = n + 1 + dfs((1 << n) - 1 - t);
        for (int m = 0; m < n - 1; m++) {
            int cand = (n - 1) + 1 + m + 1 + dfs(t - (1 << (n - 1)) + (1 << m));
            if (cand < ans) ans = cand;
        }
        memo.put(t, ans);
        return ans;
    }
    public boolean isCorrect(int target, int output) {
        return racecar(target) == output;
    }
}
