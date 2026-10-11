import java.util.*;
class Marker {
    public int numDistinctIslands2(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        boolean[][] vis = new boolean[m][n];
        Set<String> shapes = new HashSet<>();
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 1 && !vis[r][c]) {
                    List<int[]> pts = new ArrayList<>();
                    Deque<int[]> dq = new ArrayDeque<>();
                    dq.add(new int[]{r, c});
                    vis[r][c] = true;
                    while (!dq.isEmpty()) {
                        int[] cur = dq.poll();
                        pts.add(cur);
                        for (int[] d : dirs) {
                            int nr = cur[0] + d[0], nc = cur[1] + d[1];
                            if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
                            if (vis[nr][nc] || grid[nr][nc] == 0) continue;
                            vis[nr][nc] = true;
                            dq.add(new int[]{nr, nc});
                        }
                    }
                    shapes.add(canonical(pts));
                }
            }
        }
        return shapes.size();
    }
    private String canonical(List<int[]> pts) {
        String best = null;
        for (int t = 0; t < 8; t++) {
            List<int[]> tr = new ArrayList<>();
            for (int[] p : pts) {
                int x = p[0], y = p[1];
                int nx = 0, ny = 0;
                if (t == 0) { nx = x; ny = y; }
                else if (t == 1) { nx = x; ny = -y; }
                else if (t == 2) { nx = -x; ny = y; }
                else if (t == 3) { nx = -x; ny = -y; }
                else if (t == 4) { nx = y; ny = x; }
                else if (t == 5) { nx = y; ny = -x; }
                else if (t == 6) { nx = -y; ny = x; }
                else { nx = -y; ny = -x; }
                tr.add(new int[]{nx, ny});
            }
            int minX = Integer.MAX_VALUE, minY = Integer.MAX_VALUE;
            for (int[] q : tr) { minX = Math.min(minX, q[0]); minY = Math.min(minY, q[1]); }
            for (int[] q : tr) { q[0] -= minX; q[1] -= minY; }
            tr.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
            StringBuilder sb = new StringBuilder();
            for (int[] q : tr) sb.append(q[0]).append(',').append(q[1]).append(';');
            String s = sb.toString();
            if (best == null || s.compareTo(best) < 0) best = s;
        }
        return best;
    }
    public boolean isCorrect(int[][] grid, int output) {
        return numDistinctIslands2(grid) == output;
    }
}
