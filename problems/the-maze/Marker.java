import java.util.*;
class Marker {
    public boolean hasPath(int[][] maze, int[] start, int[] destination) {
        int m = maze.length, n = maze[0].length;
        boolean[][] vis = new boolean[m][n];
        Deque<int[]> q = new ArrayDeque<>();
        q.add(new int[]{start[0], start[1]});
        vis[start[0]][start[1]] = true;
        int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            if (cur[0] == destination[0] && cur[1] == destination[1]) return true;
            for (int[] d : dirs) {
                int x = cur[0], y = cur[1];
                while (x + d[0] >= 0 && x + d[0] < m && y + d[1] >= 0 && y + d[1] < n && maze[x + d[0]][y + d[1]] == 0) {
                    x += d[0];
                    y += d[1];
                }
                if (!vis[x][y]) {
                    vis[x][y] = true;
                    q.add(new int[]{x, y});
                }
            }
        }
        return false;
    }
    public boolean isCorrect(int[][] maze, int[] start, int[] destination, boolean output) {
        return hasPath(maze, start, destination) == output;
    }
}
