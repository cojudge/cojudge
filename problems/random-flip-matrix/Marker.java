import java.util.*;
class Marker {
    public int[][] runFlip(int m, int n, int count) {
        int total = m * n;
        int k = Math.min(count, total);
        int[][] ans = new int[k][2];
        for (int i = 0; i < k; i++) {
            ans[i][0] = i / n;
            ans[i][1] = i % n;
        }
        return ans;
    }
    public boolean isCorrect(int m, int n, int count, int[][] output) {
        if (output == null) return false;
        int total = m * n;
        int want = Math.min(count, total);
        if (output.length != want) return false;
        Set<Integer> seen = new HashSet<>();
        for (int[] cell : output) {
            if (cell == null || cell.length != 2) return false;
            int r = cell[0], c = cell[1];
            if (r < 0 || r >= m || c < 0 || c >= n) return false;
            if (!seen.add(r * n + c)) return false;
        }
        return true;
    }
}
