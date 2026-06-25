import java.util.*;
class Marker {
    public int[][] setZeroes(int[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) return matrix;
        int m = matrix.length, n = matrix[0].length;
        boolean firstRowZero = false, firstColZero = false;

        for (int c = 0; c < n; c++) {
            if (matrix[0][c] == 0) {
                firstRowZero = true;
                break;
            }
        }
        for (int r = 0; r < m; r++) {
            if (matrix[r][0] == 0) {
                firstColZero = true;
                break;
            }
        }

        for (int r = 1; r < m; r++) {
            for (int c = 1; c < n; c++) {
                if (matrix[r][c] == 0) {
                    matrix[r][0] = 0;
                    matrix[0][c] = 0;
                }
            }
        }

        for (int r = 1; r < m; r++) {
            if (matrix[r][0] == 0) {
                Arrays.fill(matrix[r], 0);
            }
        }
        for (int c = 1; c < n; c++) {
            if (matrix[0][c] == 0) {
                for (int r = 0; r < m; r++) matrix[r][c] = 0;
            }
        }

        if (firstRowZero) Arrays.fill(matrix[0], 0);
        if (firstColZero) {
            for (int r = 0; r < m; r++) matrix[r][0] = 0;
        }

        return matrix;
    }

    private boolean deepEquals(int[][] a, int[][] b) {
        if (a == null || b == null) return a == b;
        if (a.length != b.length) return false;
        for (int i = 0; i < a.length; i++) {
            if (!Arrays.equals(a[i], b[i])) return false;
        }
        return true;
    }

    public boolean isCorrect(int[][] matrix, int[][] output) {
        int[][] ans = setZeroes(matrix);
        return deepEquals(ans, output);
    }
}
