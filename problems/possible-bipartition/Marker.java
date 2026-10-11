import java.util.*;
class Marker {
    public boolean possibleBipartition(int n, int[][] dislikes) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i <= n; i++) g.add(new ArrayList<Integer>());
        for (int[] d : dislikes) {
            g.get(d[0]).add(d[1]);
            g.get(d[1]).add(d[0]);
        }
        int[] color = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            if (color[i] != 0) continue;
            color[i] = 1;
            Deque<Integer> q = new ArrayDeque<>();
            q.add(i);
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int v : g.get(u)) {
                    if (color[v] == 0) {
                        color[v] = -color[u];
                        q.add(v);
                    } else if (color[v] == color[u]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    public boolean isCorrect(int n, int[][] dislikes, boolean output) {
        return possibleBipartition(n, dislikes) == output;
    }
}
