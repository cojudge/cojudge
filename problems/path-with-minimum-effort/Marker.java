import java.util.*;

class Marker {
    public int minimumEffortPath(int[][] heights) {
        int rows = heights.length, cols = heights[0].length;
        int[][] dist = new int[rows][cols];
        for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE);
        dist[0][0] = 0;
        // Dijkstra where edge weight = abs height diff, path cost = max edge
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[]{0, 0, 0});
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int effort = cur[0], r = cur[1], c = cur[2];
            if (r == rows - 1 && c == cols - 1) return effort;
            if (effort > dist[r][c]) continue;
            for (int[] d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                int next = Math.max(effort, Math.abs(heights[r][c] - heights[nr][nc]));
                if (next < dist[nr][nc]) {
                    dist[nr][nc] = next;
                    pq.offer(new int[]{next, nr, nc});
                }
            }
        }
        return dist[rows-1][cols-1];
    }

    public boolean isCorrect(int[][] heights, int output) {
        return minimumEffortPath(heights) == output;
    }
}
