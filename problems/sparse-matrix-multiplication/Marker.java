import java.util.*;
class Marker {
    public int[][] multiply(int[][] mat1, int[][] mat2) {
        int m = mat1.length, k = mat1[0].length, n = mat2[0].length;
        int[][] ans = new int[m][n];
        for (int i = 0; i < m; i++) {
            for (int p = 0; p < k; p++) {
                if (mat1[i][p] == 0) continue;
                for (int j = 0; j < n; j++) {
                    ans[i][j] += mat1[i][p] * mat2[p][j];
                }
            }
        }
        return ans;
    }
    public boolean isCorrect(int[][] mat1, int[][] mat2, int[][] output) {
        return Arrays.deepEquals(multiply(mat1, mat2), output);
    }
}
