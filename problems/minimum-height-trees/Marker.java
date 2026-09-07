import java.util.*;
class Marker {
    public int[] findMinHeightTrees(int n, int[][] edges) {
        if (n == 1) return new int[]{0};
        List<Set<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new HashSet<>());
        for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
        List<Integer> leaves = new ArrayList<>();
        for (int i = 0; i < n; i++) if (g.get(i).size() == 1) leaves.add(i);
        int remain = n;
        while (remain > 2) {
            remain -= leaves.size();
            List<Integer> next = new ArrayList<>();
            for (int leaf : leaves) {
                int nb = g.get(leaf).iterator().next();
                g.get(nb).remove(leaf);
                if (g.get(nb).size() == 1) next.add(nb);
            }
            leaves = next;
        }
        int[] res = new int[leaves.size()];
        for (int i = 0; i < leaves.size(); i++) res[i] = leaves.get(i);
        Arrays.sort(res);
        return res;
    }
    public boolean isCorrect(int n, int[][] edges, int[] output) {
        int[] exp = findMinHeightTrees(n, edges);
        if (output == null || output.length != exp.length) return false;
        int[] a = output.clone(); Arrays.sort(a);
        return Arrays.equals(a, exp);
    }
}
