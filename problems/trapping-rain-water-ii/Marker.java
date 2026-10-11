import java.util.*;
class Marker {
    public int trapRainWater(int[][] h) {
        if (h == null || h.length == 0 || h[0].length == 0) return 0;
        int m = h.length, n = h[0].length;
        if (m <= 2 || n <= 2) {
            // still run heap logic (handles 1-row/col as zero) but keep general
        }
        boolean[][] vis = new boolean[m][n];
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        for (int i = 0; i < m; i++) {
            pq.offer(new int[]{h[i][0], i, 0}); vis[i][0] = true;
            if (n > 1) { pq.offer(new int[]{h[i][n-1], i, n-1}); vis[i][n-1] = true; }
        }
        for (int j = 1; j < n - 1; j++) {
            pq.offer(new int[]{h[0][j], 0, j}); vis[0][j] = true;
            if (m > 1) { pq.offer(new int[]{h[m-1][j], m-1, j}); vis[m-1][j] = true; }
        }
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        int water = 0;
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int height = cur[0], x = cur[1], y = cur[2];
            for (int[] d : dirs) {
                int nx = x + d[0], ny = y + d[1];
                if (nx < 0 || nx >= m || ny < 0 || ny >= n || vis[nx][ny]) continue;
                vis[nx][ny] = true;
                water += Math.max(0, height - h[nx][ny]);
                pq.offer(new int[]{Math.max(height, h[nx][ny]), nx, ny});
            }
        }
        return water;
    }
    public boolean isCorrect(int[][] heightMap, int output) {
        return trapRainWater(heightMap) == output;
    }
}
