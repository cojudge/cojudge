import java.util.*;
class Marker {
    public int shortestPathLength(int[][] graph) {
        int n = graph.length;
        if (n == 1) return 0;
        int full = (1 << n) - 1;
        boolean[][] seen = new boolean[1 << n][n];
        Deque<int[]> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            int m = 1 << i;
            seen[m][i] = true;
            q.offer(new int[]{m, i, 0});
        }
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            int mask = cur[0], u = cur[1], d = cur[2];
            for (int v : graph[u]) {
                int nm = mask | (1 << v);
                if (nm == full) return d + 1;
                if (!seen[nm][v]) {
                    seen[nm][v] = true;
                    q.offer(new int[]{nm, v, d + 1});
                }
            }
        }
        return -1;
    }
    public boolean isCorrect(int[][] graph, int output) {
        return shortestPathLength(graph) == output;
    }
}
