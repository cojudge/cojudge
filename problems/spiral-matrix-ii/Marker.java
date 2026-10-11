import java.util.*;
class Marker {
    public int[][] generateMatrix(int n) {
        int[][] m = new int[n][n];
        int top = 0, bottom = n - 1, left = 0, right = n - 1, num = 1;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) m[top][j] = num++;
            top++;
            for (int i = top; i <= bottom; i++) m[i][right] = num++;
            right--;
            if (top <= bottom) {
                for (int j = right; j >= left; j--) m[bottom][j] = num++;
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) m[i][left] = num++;
                left++;
            }
        }
        return m;
    }
    public boolean isCorrect(int n, int[][] output) {
        return Arrays.deepEquals(generateMatrix(n), output);
    }
}
