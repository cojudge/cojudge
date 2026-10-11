import java.util.*;
class Marker {
    public int shortestDistance(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[][] total = new int[m][n];
        int[][] reach = new int[m][n];
        int buildings = 0;
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] != 1) continue;
                buildings++;
                boolean[][] seen = new boolean[m][n];
                Queue<int[]> q = new ArrayDeque<>();
                q.add(new int[]{r, c});
                seen[r][c] = true;
                int dist = 0;
                while (!q.isEmpty()) {
                    int size = q.size();
                    dist++;
                    for (int k = 0; k < size; k++) {
                        int[] cur = q.poll();
                        for (int d = 0; d < 4; d++) {
                            int nr = cur[0] + dr[d], nc = cur[1] + dc[d];
                            if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
                            if (seen[nr][nc] || grid[nr][nc] != 0) continue;
                            seen[nr][nc] = true;
                            total[nr][nc] += dist;
                            reach[nr][nc]++;
                            q.add(new int[]{nr, nc});
                        }
                    }
                }
            }
        }
        if (buildings == 0) return -1;
        int best = Integer.MAX_VALUE;
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 0 && reach[r][c] == buildings) {
                    best = Math.min(best, total[r][c]);
                }
            }
        }
        return best == Integer.MAX_VALUE ? -1 : best;
    }
    public boolean isCorrect(int[][] grid, int output) {
        return shortestDistance(grid) == output;
    }
}
