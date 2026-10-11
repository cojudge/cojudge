import java.util.*;
class Marker {
    public int[] hitBricks(int[][] grid, int[][] hits) {
        int m = grid.length, n = grid[0].length;
        int[][] cur = new int[m][n];
        for (int i = 0; i < m; i++) cur[i] = grid[i].clone();
        int stableBefore = countStable(cur);
        int[] ans = new int[hits.length];
        for (int t = 0; t < hits.length; t++) {
            int x = hits[t][0], y = hits[t][1];
            if (x < 0 || x >= m || y < 0 || y >= n || cur[x][y] == 0) { ans[t] = 0; continue; }
            cur[x][y] = 0;
            int stableAfter = countStable(cur);
            ans[t] = Math.max(0, stableBefore - stableAfter - 1);
            stableBefore = stableAfter;
        }
        return ans;
    }
    private int countStable(int[][] g) {
        int m = g.length, n = g[0].length;
        boolean[][] vis = new boolean[m][n];
        Deque<int[]> dq = new ArrayDeque<>();
        for (int c = 0; c < n; c++) if (g[0][c] == 1 && !vis[0][c]) { vis[0][c] = true; dq.add(new int[]{0, c}); }
        int cnt = 0;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!dq.isEmpty()) {
            int[] p = dq.poll();
            cnt++;
            for (int[] d : dirs) {
                int nr = p[0] + d[0], nc = p[1] + d[1];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && g[nr][nc] == 1 && !vis[nr][nc]) {
                    vis[nr][nc] = true;
                    dq.add(new int[]{nr, nc});
                }
            }
        }
        return cnt;
    }
    public boolean isCorrect(int[][] grid, int[][] hits, int[] output) {
        return Arrays.equals(hitBricks(grid, hits), output);
    }
}
