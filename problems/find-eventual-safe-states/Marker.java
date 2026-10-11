import java.util.*;
class Marker {
    public List<Integer> eventualSafeNodes(int[][] graph) {
        int n = graph.length;
        int[] color = new int[n];
        List<Integer> res = new ArrayList<>();
        for (int i = 0; i < n; i++) if (safe(i, graph, color)) res.add(i);
        return res;
    }
    private boolean safe(int u, int[][] g, int[] color) {
        if (color[u] != 0) return color[u] == 2;
        color[u] = 1;
        for (int v : g[u]) if (!safe(v, g, color)) return false;
        color[u] = 2;
        return true;
    }
    public boolean isCorrect(int[][] graph, List<Integer> output) {
        if (output == null) return false;
        List<Integer> e = eventualSafeNodes(graph);
        List<Integer> got = new ArrayList<>(output);
        Collections.sort(got);
        Collections.sort(e);
        return e.equals(got);
    }
}
