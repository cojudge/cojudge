import java.util.*;
class Marker {
    public int[] constructArray(int n, int k) {
        int[] ans = new int[n];
        int idx = 0;
        int lo = 1, hi = k + 1;
        while (lo <= hi) {
            ans[idx++] = lo++;
            if (lo <= hi) ans[idx++] = hi--;
        }
        for (int v = k + 2; v <= n; v++) ans[idx++] = v;
        return ans;
    }
    public boolean isCorrect(int n, int k, int[] output) {
        if (output == null || output.length != n) return false;
        boolean[] seen = new boolean[n + 1];
        for (int v : output) {
            if (v < 1 || v > n || seen[v]) return false;
            seen[v] = true;
        }
        Set<Integer> diffs = new HashSet<>();
        for (int i = 0; i + 1 < n; i++) diffs.add(Math.abs(output[i] - output[i+1]));
        return diffs.size() == k;
    }
}
