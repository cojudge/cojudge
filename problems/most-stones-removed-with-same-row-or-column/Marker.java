import java.util.*;
class Marker {
    public int removeStones(int[][] stones) {
        int n = stones.length;
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
        int comps = n;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (stones[i][0] == stones[j][0] || stones[i][1] == stones[j][1]) {
                    if (union(parent, i, j)) {
                        comps--;
                    }
                }
            }
        }
        return n - comps;
    }
    private int find(int[] parent, int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
    private boolean union(int[] parent, int a, int b) {
        int ra = find(parent, a);
        int rb = find(parent, b);
        if (ra == rb) return false;
        parent[ra] = rb;
        return true;
    }
    public boolean isCorrect(int[][] stones, int output) {
        return removeStones(stones) == output;
    }
}
