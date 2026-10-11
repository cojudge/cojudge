import java.util.*;
class Marker {
    private int[][] counts;
    private String target;
    private int[] memo;
    public int minStickers(String[] stickers, String target) {
        this.target = target;
        int n = stickers.length;
        counts = new int[n][26];
        for (int i = 0; i < n; i++) {
            for (char c : stickers[i].toCharArray()) counts[i][c - 'a']++;
        }
        // quick impossibility check
        boolean[] has = new boolean[26];
        for (int[] co : counts) for (int j = 0; j < 26; j++) if (co[j] > 0) has[j] = true;
        for (char c : target.toCharArray()) if (!has[c - 'a']) return -1;
        int m = target.length();
        memo = new int[1 << m];
        Arrays.fill(memo, -2);
        // filter stickers to only useful ones (map to counts)
        int ans = dfs(0);
        return ans >= 1e9 ? -1 : ans;
    }
    private int dfs(int mask) {
        if (memo[mask] != -2) return memo[mask];
        int m = target.length();
        if (mask == (1 << m) - 1) return memo[mask] = 0;
        // find first uncovered
        int first = -1;
        for (int i = 0; i < m; i++) if ((mask & (1 << i)) == 0) { first = i; break; }
        int best = (int) 1e9;
        for (int[] co : counts) {
            if (co[target.charAt(first) - 'a'] == 0) continue;
            int[] rem = co.clone();
            int nmask = mask;
            for (int i = 0; i < m; i++) {
                if ((nmask & (1 << i)) != 0) continue;
                int c = target.charAt(i) - 'a';
                if (rem[c] > 0) {
                    rem[c]--;
                    nmask |= (1 << i);
                }
            }
            if (nmask == mask) continue;
            int sub = dfs(nmask);
            if (sub < 1e9) best = Math.min(best, 1 + sub);
        }
        return memo[mask] = best;
    }
    public boolean isCorrect(String[] stickers, String target, int output) {
        return minStickers(stickers.clone(), target) == output;
    }
}
