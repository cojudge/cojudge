import java.util.*;
class Marker {
    public int maxSumSubmatrix(int[][] matrix, int k) {
        int m = matrix.length, n = matrix[0].length;
        int best = Integer.MIN_VALUE;
        for (int l = 0; l < n; l++) {
            int[] sums = new int[m];
            for (int r = l; r < n; r++) {
                for (int i = 0; i < m; i++) sums[i] += matrix[i][r];
                best = Math.max(best, maxSubNoLarger(sums, k));
                if (best == k) return k;
            }
        }
        return best;
    }
    private int maxSubNoLarger(int[] a, int k) {
        TreeSet<Integer> s = new TreeSet<>();
        s.add(0);
        int cur = 0, best = Integer.MIN_VALUE;
        for (int x : a) {
            cur += x;
            Integer need = s.ceiling(cur - k);
            if (need != null) best = Math.max(best, cur - need);
            s.add(cur);
        }
        return best;
    }
    public boolean isCorrect(int[][] matrix, int k, int output) {
        return maxSumSubmatrix(matrix, k) == output;
    }
}
