import java.util.*;
class Marker {
    public int[] sumRegion(int[][] matrix, int[][] queries) {
        int m = matrix.length, n = matrix[0].length;
        int[][] pref = new int[m + 1][n + 1];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                pref[i + 1][j + 1] = pref[i][j + 1] + pref[i + 1][j] - pref[i][j] + matrix[i][j];
            }
        }
        int[] ans = new int[queries.length];
        for (int q = 0; q < queries.length; q++) {
            int r1 = queries[q][0], c1 = queries[q][1], r2 = queries[q][2], c2 = queries[q][3];
            ans[q] = pref[r2 + 1][c2 + 1] - pref[r1][c2 + 1] - pref[r2 + 1][c1] + pref[r1][c1];
        }
        return ans;
    }
    public boolean isCorrect(int[][] matrix, int[][] queries, int[] output) {
        return Arrays.equals(sumRegion(matrix, queries), output);
    }
}
