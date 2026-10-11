import java.util.*;
class Marker {
    public int[] beautifulArray(int n) {
        List<Integer> cur = new ArrayList<>();
        cur.add(1);
        while (cur.size() < n) {
            List<Integer> nxt = new ArrayList<>();
            for (int x : cur) {
                int v = 2 * x - 1;
                if (v <= n) nxt.add(v);
            }
            for (int x : cur) {
                int v = 2 * x;
                if (v <= n) nxt.add(v);
            }
            cur = nxt;
        }
        int[] ans = new int[n];
        for (int i = 0; i < n; i++) ans[i] = cur.get(i);
        return ans;
    }
    public boolean isCorrect(int n, int[] output) {
        if (output == null || output.length != n) return false;
        boolean[] seen = new boolean[n + 1];
        for (int v : output) {
            if (v < 1 || v > n || seen[v]) return false;
            seen[v] = true;
        }
        Set<Integer> right = new HashSet<>();
        for (int j = 0; j < n; j++) {
            Set<Integer> left = new HashSet<>();
            for (int i = 0; i < j; i++) left.add(output[i]);
            right.clear();
            for (int k = j + 1; k < n; k++) right.add(output[k]);
            for (int a : left) {
                int need = 2 * output[j] - a;
                if (right.contains(need)) return false;
            }
        }
        return true;
    }
}
