import java.util.*;
class Marker {
    public int[] findRedundantDirectedConnection(int[][] edges) {
        int n = edges.length;
        int[] parent = new int[n + 1];
        int candA = -1, candB = -1;
        for (int i = 0; i < n; i++) {
            int u = edges[i][0], v = edges[i][1];
            if (parent[v] == 0) parent[v] = i + 1;
            else { candA = parent[v] - 1; candB = i; break; }
        }
        if (candA == -1) {
            // no double parent: last edge forming cycle
            int[] ds = new int[n + 1];
            for (int i = 1; i <= n; i++) ds[i] = i;
            for (int i = 0; i < n; i++) {
                int u = edges[i][0], v = edges[i][1];
                int pu = find(ds, u), pv = find(ds, v);
                if (pu == pv) return edges[i];
                ds[pu] = pv;
            }
        } else {
            // try removing candB then candA
            if (!hasCycle(edges, candB, n)) return edges[candB];
            return edges[candA];
        }
        return new int[0];
    }
    private boolean hasCycle(int[][] edges, int skip, int n) {
        int[] ds = new int[n + 1];
        for (int i = 1; i <= n; i++) ds[i] = i;
        for (int i = 0; i < edges.length; i++) {
            if (i == skip) continue;
            int u = edges[i][0], v = edges[i][1];
            int pu = find(ds, u), pv = find(ds, v);
            if (pu == pv) return true;
            ds[pu] = pv;
        }
        return false;
    }
    private int find(int[] ds, int x) {
        while (ds[x] != x) { ds[x] = ds[ds[x]]; x = ds[x]; }
        return x;
    }
    public boolean isCorrect(int[][] edges, int[] output) {
        return Arrays.equals(findRedundantDirectedConnection(edges), output);
    }
}
