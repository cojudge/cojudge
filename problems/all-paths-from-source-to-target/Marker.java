import java.util.*;
class Marker {
    public List<List<Integer>> allPathsSourceTarget(int[][] graph) {
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        path.add(0);
        dfs(graph, 0, path, res);
        return res;
    }
    private void dfs(int[][] g, int u, List<Integer> path, List<List<Integer>> res) {
        if (u == g.length - 1) {
            res.add(new ArrayList<>(path));
            return;
        }
        for (int v : g[u]) {
            path.add(v);
            dfs(g, v, path, res);
            path.remove(path.size() - 1);
        }
    }
    private List<List<Integer>> norm(List<List<Integer>> l) {
        List<List<Integer>> c = new ArrayList<>();
        for (List<Integer> r : l) c.add(new ArrayList<>(r));
        c.sort((a, b) -> {
            int m = Math.min(a.size(), b.size());
            for (int i = 0; i < m; i++) {
                int d = Integer.compare(a.get(i), b.get(i));
                if (d != 0) return d;
            }
            return Integer.compare(a.size(), b.size());
        });
        return c;
    }
    public boolean isCorrect(int[][] graph, List<List<Integer>> output) {
        if (output == null) return false;
        return norm(allPathsSourceTarget(graph)).equals(norm(output));
    }
}
