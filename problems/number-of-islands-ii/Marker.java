import java.util.*;
class Marker {
    public List<Integer> numIslands2(int m, int n, int[][] positions) {
        List<Integer> res = new ArrayList<>();
        int[] parent = new int[m * n];
        Arrays.fill(parent, -1);
        int count = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int[] p : positions) {
            int id = p[0] * n + p[1];
            if (parent[id] != -1) {
                res.add(count);
                continue;
            }
            parent[id] = id;
            count++;
            for (int[] d : dirs) {
                int nr = p[0] + d[0], nc = p[1] + d[1];
                if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
                int nid = nr * n + nc;
                if (parent[nid] == -1) continue;
                if (union(parent, id, nid)) count--;
            }
            res.add(count);
        }
        return res;
    }
    private int find(int[] parent, int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
    private boolean union(int[] parent, int a, int b) {
        int ra = find(parent, a), rb = find(parent, b);
        if (ra == rb) return false;
        parent[ra] = rb;
        return true;
    }
    public boolean isCorrect(int m, int n, int[][] positions, List<Integer> output) {
        return numIslands2(m, n, positions).equals(output);
    }
}
