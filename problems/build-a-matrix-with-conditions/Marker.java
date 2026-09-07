import java.util.*;
class Marker {
    public int[][] buildMatrix(int k, int[][] rowConditions, int[][] colConditions) {
        int[] rowOrder = topo(k, rowConditions);
        int[] colOrder = topo(k, colConditions);
        if (rowOrder == null || colOrder == null) return new int[0][];
        int[] rowPos = new int[k + 1], colPos = new int[k + 1];
        for (int i = 0; i < k; i++) { rowPos[rowOrder[i]] = i; colPos[colOrder[i]] = i; }
        int[][] mat = new int[k][k];
        for (int num = 1; num <= k; num++) mat[rowPos[num]][colPos[num]] = num;
        return mat;
    }
    private int[] topo(int k, int[][] cond) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i <= k; i++) g.add(new ArrayList<>());
        int[] indeg = new int[k + 1];
        for (int[] c : cond) {
            g.get(c[0]).add(c[1]);
            indeg[c[1]]++;
        }
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 1; i <= k; i++) if (indeg[i] == 0) q.offer(i);
        int[] order = new int[k];
        int idx = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            order[idx++] = u;
            for (int v : g.get(u)) if (--indeg[v] == 0) q.offer(v);
        }
        return idx == k ? order : null;
    }
    public boolean isCorrect(int k, int[][] rowConditions, int[][] colConditions, int[][] output) {
        int[][] exp = buildMatrix(k, rowConditions, colConditions);
        if (exp.length == 0) return output == null || output.length == 0;
        if (output == null || output.length != k) return false;
        // Validate output is a valid placement satisfying conditions
        int[] rpos = new int[k + 1], cpos = new int[k + 1];
        Arrays.fill(rpos, -1); Arrays.fill(cpos, -1);
        for (int i = 0; i < k; i++) {
            if (output[i] == null || output[i].length != k) return false;
            for (int j = 0; j < k; j++) {
                int v = output[i][j];
                if (v == 0) continue;
                if (v < 1 || v > k || rpos[v] != -1) return false;
                rpos[v] = i; cpos[v] = j;
            }
        }
        for (int v = 1; v <= k; v++) if (rpos[v] == -1) return false;
        for (int[] c : rowConditions) if (rpos[c[0]] >= rpos[c[1]]) return false;
        for (int[] c : colConditions) if (cpos[c[0]] >= cpos[c[1]]) return false;
        return true;
    }
}
