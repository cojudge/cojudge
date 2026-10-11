import java.util.*;
class Marker {
    public int maximalRectangle(char[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) return 0;
        int n = matrix[0].length;
        int[] h = new int[n + 1];
        int best = 0;
        for (char[] row : matrix) {
            for (int j = 0; j < n; j++) {
                h[j] = (row[j] == '1') ? h[j] + 1 : 0;
            }
            Deque<Integer> st = new ArrayDeque<>();
            for (int j = 0; j <= n; j++) {
                int cur = (j == n) ? 0 : h[j];
                while (!st.isEmpty() && cur < h[st.peek()]) {
                    int height = h[st.pop()];
                    int left = st.isEmpty() ? -1 : st.peek();
                    best = Math.max(best, height * (j - left - 1));
                }
                st.push(j);
            }
        }
        return best;
    }
    public boolean isCorrect(char[][] matrix, int output) {
        return output == maximalRectangle(matrix);
    }
}
