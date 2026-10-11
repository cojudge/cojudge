import java.util.*;
class Marker {
    public int cleanRoom(int[][] room, int row, int col) {
        int m = room.length, n = room[0].length;
        boolean[][] vis = new boolean[m][n];
        Deque<int[]> dq = new ArrayDeque<>();
        dq.add(new int[]{row, col});
        vis[row][col] = true;
        int cnt = 0;
        int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
        while (!dq.isEmpty()) {
            int[] cur = dq.poll();
            cnt++;
            for (int[] d : dirs) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
                if (vis[nr][nc]) continue;
                if (room[nr][nc] == 0) continue;
                vis[nr][nc] = true;
                dq.add(new int[]{nr, nc});
            }
        }
        return cnt;
    }
    public boolean isCorrect(int[][] room, int row, int col, int output) {
        return cleanRoom(room, row, col) == output;
    }
}
