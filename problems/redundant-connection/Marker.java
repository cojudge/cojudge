import java.util.*;

class Marker {
    public int[] findRedundantConnection(int[][] edges) {
        int[] parent = new int[edges.length + 1];
        int[] size = new int[edges.length + 1];
        for (int node = 1; node <= edges.length; node++) {
            parent[node] = node;
            size[node] = 1;
        }

        for (int[] edge : edges) {
            int rootA = find(parent, edge[0]);
            int rootB = find(parent, edge[1]);
            if (rootA == rootB) return new int[]{edge[0], edge[1]};
            if (size[rootA] < size[rootB]) {
                int temp = rootA;
                rootA = rootB;
                rootB = temp;
            }
            parent[rootB] = rootA;
            size[rootA] += size[rootB];
        }
        return new int[0];
    }

    private int find(int[] parent, int node) {
        while (node != parent[node]) {
            parent[node] = parent[parent[node]];
            node = parent[node];
        }
        return node;
    }

    public boolean isCorrect(int[][] edges, int[] output) {
        return output != null && Arrays.equals(findRedundantConnection(edges), output);
    }
}
