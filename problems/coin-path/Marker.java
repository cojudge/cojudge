import java.util.*;
class Marker {
    public List<Integer> cheapestJump(int[] coins, int maxJump) {
        int n = coins.length;
        List<Integer> empty = new ArrayList<>();
        if (n == 0 || coins[0] == -1 || coins[n-1] == -1) return empty;
        long INF = Long.MAX_VALUE / 4;
        long[] dp = new long[n];
        int[] nxt = new int[n];
        Arrays.fill(dp, INF);
        Arrays.fill(nxt, -1);
        dp[n-1] = coins[n-1];
        for (int i = n - 2; i >= 0; i--) {
            if (coins[i] == -1) continue;
            for (int j = i + 1; j <= Math.min(n - 1, i + maxJump); j++) {
                if (coins[j] == -1 || dp[j] == INF) continue;
                long cand = (long)coins[i] + dp[j];
                if (cand < dp[i]) { dp[i] = cand; nxt[i] = j; }
                else if (cand == dp[i]) {
                    if (isLexSmaller(j, nxt[i], nxt)) nxt[i] = j;
                }
            }
        }
        if (dp[0] == INF) return empty;
        List<Integer> path = new ArrayList<>();
        int cur = 0;
        while (cur != -1) { path.add(cur + 1); if (cur == n - 1) break; cur = nxt[cur]; }
        if (path.get(path.size()-1) != n) return empty;
        return path;
    }
    private boolean isLexSmaller(int a, int b, int[] nxt) {
        if (b == -1) return true;
        int x = a, y = b;
        while (x != -1 && y != -1) {
            if (x < y) return true;
            if (x > y) return false;
            x = nxt[x]; y = nxt[y];
        }
        if (x == -1 && y == -1) return false;
        return x == -1;
    }
    public boolean isCorrect(int[] coins, int maxJump, List<Integer> output) {
        List<Integer> exp = cheapestJump(coins.clone(), maxJump);
        return exp.equals(output);
    }
}
