import java.util.*;
class Marker {
    public int shortestDistance(int[][] maze, int[] start, int[] destination) {
        int m = maze.length, n = maze[0].length;
        int[][] dist = new int[m][n];
        for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE);
        dist[start[0]][start[1]] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[2]));
        pq.offer(new int[]{start[0], start[1], 0});
        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int r = cur[0], c = cur[1], d = cur[2];
            if (d != dist[r][c]) continue;
            if (r == destination[0] && c == destination[1]) return d;
            for (int[] dir : dirs) {
                int nr = r, nc = c, steps = 0;
                while (nr + dir[0] >= 0 && nr + dir[0] < m && nc + dir[1] >= 0 && nc + dir[1] < n
                        && maze[nr + dir[0]][nc + dir[1]] == 0) {
                    nr += dir[0];
                    nc += dir[1];
                    steps++;
                }
                if (dist[nr][nc] > d + steps) {
                    dist[nr][nc] = d + steps;
                    pq.offer(new int[]{nr, nc, d + steps});
                }
            }
        }
        int ans = dist[destination[0]][destination[1]];
        return ans == Integer.MAX_VALUE ? -1 : ans;
    }
    public boolean isCorrect(int[][] maze, int[] start, int[] destination, int output) {
        return output == shortestDistance(maze, start, destination);
    }
}
