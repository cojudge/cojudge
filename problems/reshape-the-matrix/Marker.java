import java.util.*;
class Marker {
    public int[][] matrixReshape(int[][] mat, int r, int c) {
        int m = mat.length, n = mat[0].length;
        if (r * c != m * n) return mat;
        int[][] ans = new int[r][c];
        for (int k = 0; k < m * n; k++)
            ans[k / c][k % c] = mat[k / n][k % n];
        return ans;
    }
    public boolean isCorrect(int[][] mat, int r, int c, int[][] output) {
        return Arrays.deepEquals(matrixReshape(mat, r, c), output);
    }
}
