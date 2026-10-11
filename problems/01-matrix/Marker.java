import java.util.*;
class Marker {
    public int[][] updateMatrix(int[][] mat) {
        int m = mat.length, n = mat[0].length;
        int[][] dist = new int[m][n];
        Deque<int[]> q = new ArrayDeque<>();
        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) {
            if (mat[i][j] == 0) { dist[i][j] = 0; q.add(new int[]{i, j}); }
            else dist[i][j] = -1;
        }
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int[] d : dirs) {
                int ni = cur[0] + d[0], nj = cur[1] + d[1];
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && dist[ni][nj] == -1) {
                    dist[ni][nj] = dist[cur[0]][cur[1]] + 1;
                    q.add(new int[]{ni, nj});
                }
            }
        }
        return dist;
    }
    public boolean isCorrect(int[][] mat, int[][] output) {
        return Arrays.deepEquals(updateMatrix(mat), output);
    }
}
