import java.util.*;
class Marker {
    static class State {
        int dist; String path; int r; int c;
        State(int d, String p, int r, int c) { dist = d; path = p; this.r = r; this.c = c; }
    }
    public String findShortestWay(int[][] maze, int[] ball, int[] hole) {
        int m = maze.length, n = maze[0].length;
        int[][] dist = new int[m][n];
        String[][] path = new String[m][n];
        for (int i = 0; i < m; i++) { Arrays.fill(dist[i], Integer.MAX_VALUE); Arrays.fill(path[i], null); }
        int[] dr = {1, 0, 0, -1};
        int[] dc = {0, -1, 1, 0};
        char[] ds = {'d', 'l', 'r', 'u'};
        PriorityQueue<State> pq = new PriorityQueue<>((a, b) -> {
            if (a.dist != b.dist) return Integer.compare(a.dist, b.dist);
            return a.path.compareTo(b.path);
        });
        dist[ball[0]][ball[1]] = 0;
        path[ball[0]][ball[1]] = "";
        pq.add(new State(0, "", ball[0], ball[1]));
        while (!pq.isEmpty()) {
            State cur = pq.poll();
            if (cur.dist != dist[cur.r][cur.c] || !cur.path.equals(path[cur.r][cur.c])) continue;
            if (cur.r == hole[0] && cur.c == hole[1]) return cur.path;
            for (int k = 0; k < 4; k++) {
                int nr = cur.r, nc = cur.c, steps = cur.dist;
                String np = cur.path + ds[k];
                while (true) {
                    int tr = nr + dr[k], tc = nc + dc[k];
                    if (tr < 0 || tr >= m || tc < 0 || tc >= n || maze[tr][tc] == 1) break;
                    nr = tr; nc = tc; steps++;
                    if (nr == hole[0] && nc == hole[1]) break;
                }
                if (nr == cur.r && nc == cur.c) continue;
                if (steps < dist[nr][nc] || (steps == dist[nr][nc] && (path[nr][nc] == null || np.compareTo(path[nr][nc]) < 0))) {
                    dist[nr][nc] = steps;
                    path[nr][nc] = np;
                    pq.add(new State(steps, np, nr, nc));
                }
            }
        }
        return "impossible";
    }
    public boolean isCorrect(int[][] maze, int[] ball, int[] hole, String output) {
        if (output == null) return false;
        return findShortestWay(maze, ball, hole).equals(output);
    }
}
