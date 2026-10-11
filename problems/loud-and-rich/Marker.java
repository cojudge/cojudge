import java.util.*;
class Marker {
    public int[] loudAndRich(int[][] richer, int[] quiet) {
        int n = quiet.length;
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : richer) g.get(e[1]).add(e[0]);
        int[] ans = new int[n];
        Arrays.fill(ans, -1);
        for (int i = 0; i < n; i++) dfs(i, g, quiet, ans);
        return ans;
    }
    private int dfs(int x, List<List<Integer>> g, int[] quiet, int[] ans) {
        if (ans[x] >= 0) return ans[x];
        ans[x] = x;
        for (int y : g.get(x)) {
            int c = dfs(y, g, quiet, ans);
            if (quiet[c] < quiet[ans[x]]) ans[x] = c;
        }
        return ans[x];
    }
    public boolean isCorrect(int[][] richer, int[] quiet, int[] output) {
        return Arrays.equals(loudAndRich(richer, quiet), output);
    }
}
