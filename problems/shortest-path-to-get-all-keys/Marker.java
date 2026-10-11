import java.util.*;
class Marker {
    public int shortestPathAllKeys(String[] grid) {
        if (grid == null || grid.length == 0 || grid[0].length() == 0) return -1;
        int m = grid.length;
        int n = 0;
        for (String row : grid) n = Math.max(n, row.length());
        int sx = -1, sy = -1, all = 0;
        for (int i = 0; i < m; i++) for (int j = 0; j < grid[i].length(); j++) {
            char c = grid[i].charAt(j);
            if (c == '@') { sx = i; sy = j; }
            else if (c >= 'a' && c <= 'f') all |= 1 << (c - 'a');
        }
        boolean[][][] vis = new boolean[m][n][64];
        Deque<int[]> q = new ArrayDeque<>();
        if (sx < 0) return -1;
        q.offer(new int[]{sx, sy, 0});
        vis[sx][sy][0] = true;
        int steps = 0;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int sz = q.size();
            for (int t = 0; t < sz; t++) {
                int[] cur = q.poll();
                int x = cur[0], y = cur[1], mask = cur[2];
                if (mask == all) return steps;
                for (int[] d : dirs) {
                    int nx = x + d[0], ny = y + d[1];
                    if (nx < 0 || nx >= m || ny < 0 || ny >= n) continue;
                    if (ny >= grid[nx].length()) continue;
                    char c = grid[nx].charAt(ny);
                    if (c == '#') continue;
                    if (c >= 'A' && c <= 'F' && ((mask >> (c - 'A')) & 1) == 0) continue;
                    int nm = mask;
                    if (c >= 'a' && c <= 'f') nm |= 1 << (c - 'a');
                    if (!vis[nx][ny][nm]) { vis[nx][ny][nm] = true; q.offer(new int[]{nx, ny, nm}); }
                }
            }
            steps++;
        }
        return -1;
    }
    public boolean isCorrect(String[] grid, int output) {
        return shortestPathAllKeys(grid) == output;
    }
}
