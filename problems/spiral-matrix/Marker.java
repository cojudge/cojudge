import java.util.*;
class Marker {
    public int[] spiralOrder(int[][] matrix) {
        int m = matrix.length;
        if (m == 0) return new int[0];
        int n = matrix[0].length;
        int[] res = new int[m * n];
        int top = 0, bottom = m - 1, left = 0, right = n - 1, k = 0;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) res[k++] = matrix[top][j];
            top++;
            for (int i = top; i <= bottom; i++) res[k++] = matrix[i][right];
            right--;
            if (top <= bottom) {
                for (int j = right; j >= left; j--) res[k++] = matrix[bottom][j];
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) res[k++] = matrix[i][left];
                left++;
            }
        }
        return res;
    }

    private boolean arrayEquals(int[] a, int[] b) {
        return Arrays.equals(a, b);
    }

    public boolean isCorrect(int[][] matrix, int[] output) {
        int[] ans = spiralOrder(matrix);
        return arrayEquals(ans, output);
    }
}
