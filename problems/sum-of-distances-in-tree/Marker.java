import java.util.*;
class Marker {
    public int[] sumOfDistancesInTree(int n, int[][] edges) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : edges) {
            g.get(e[0]).add(e[1]);
            g.get(e[1]).add(e[0]);
        }
        int[] cnt = new int[n];
        int[] ans = new int[n];
        dfs1(0, -1, g, cnt, ans);
        dfs2(0, -1, g, cnt, ans, n);
        return ans;
    }
    private void dfs1(int u, int p, List<List<Integer>> g, int[] cnt, int[] ans) {
        cnt[u] = 1;
        for (int v : g.get(u)) {
            if (v == p) continue;
            dfs1(v, u, g, cnt, ans);
            cnt[u] += cnt[v];
            ans[u] += ans[v] + cnt[v];
        }
    }
    private void dfs2(int u, int p, List<List<Integer>> g, int[] cnt, int[] ans, int n) {
        for (int v : g.get(u)) {
            if (v == p) continue;
            ans[v] = ans[u] - cnt[v] + (n - cnt[v]);
            dfs2(v, u, g, cnt, ans, n);
        }
    }
    public boolean isCorrect(int n, int[][] edges, int[] output) {
        return Arrays.equals(sumOfDistancesInTree(n, edges), output);
    }
}
