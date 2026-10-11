import java.util.*;
class Marker {
    public int kthSmallest(int[][] matrix, int k) {
        int n = matrix.length;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) ->
            Integer.compare(matrix[a[0]][a[1]], matrix[b[0]][b[1]]));
        for (int r = 0; r < n; r++) pq.offer(new int[]{r, 0});
        int val = 0;
        for (int t = 0; t < k; t++) {
            int[] cur = pq.poll();
            val = matrix[cur[0]][cur[1]];
            if (cur[1] + 1 < matrix[cur[0]].length) pq.offer(new int[]{cur[0], cur[1] + 1});
        }
        return val;
    }
    public boolean isCorrect(int[][] matrix, int k, int output) {
        return output == kthSmallest(matrix, k);
    }
}
