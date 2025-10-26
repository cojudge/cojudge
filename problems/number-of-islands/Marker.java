import java.util.*;
class Marker {
    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};

    public int numIslands(int[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int m = grid.length, n = grid[0].length;
        boolean[][] vis = new boolean[m][n];
        int count = 0;
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 1 && !vis[r][c]) {
                    count++;
                    Deque<int[]> dq = new ArrayDeque<>();
                    dq.add(new int[]{r,c});
                    vis[r][c] = true;
                    while (!dq.isEmpty()) {
                        int[] cur = dq.poll();
                        for (int[] d : DIRS) {
                            int nr = cur[0] + d[0], nc = cur[1] + d[1];
                            if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
                            if (vis[nr][nc] || grid[nr][nc] == 0) continue;
                            vis[nr][nc] = true;
                            dq.add(new int[]{nr,nc});
                        }
                    }
                }
            }
        }
        return count;
    }

    public boolean isCorrect(int[][] grid, int output) {
        return numIslands(grid) == output;
    }
}
