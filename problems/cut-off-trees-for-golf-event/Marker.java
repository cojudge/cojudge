import java.util.*;
class Marker {
    public int cutOffTree(int[][] forest) {
        int m = forest.length, n = forest[0].length;
        List<int[]> trees = new ArrayList<>();
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (forest[i][j] > 1) trees.add(new int[]{forest[i][j], i, j});
        trees.sort(Comparator.comparingInt(a -> a[0]));
        int sr = 0, sc = 0, total = 0;
        for (int[] t : trees) {
            int d = bfs(forest, sr, sc, t[1], t[2]);
            if (d < 0) return -1;
            total += d;
            sr = t[1]; sc = t[2];
        }
        return total;
    }
    private int bfs(int[][] g, int sr, int sc, int tr, int tc) {
        if (sr == tr && sc == tc) return 0;
        int m = g.length, n = g[0].length;
        boolean[][] vis = new boolean[m][n];
        Deque<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{sr, sc});
        vis[sr][sc] = true;
        int dist = 0;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int sz = q.size();
            dist++;
            for (int k = 0; k < sz; k++) {
                int[] cur = q.poll();
                for (int[] d : dirs) {
                    int nr = cur[0]+d[0], nc = cur[1]+d[1];
                    if (nr<0||nr>=m||nc<0||nc>=n||vis[nr][nc]||g[nr][nc]==0) continue;
                    if (nr==tr&&nc==tc) return dist;
                    vis[nr][nc]=true;
                    q.offer(new int[]{nr,nc});
                }
            }
        }
        return -1;
    }
    public boolean isCorrect(int[][] forest, int output) {
        return cutOffTree(forest) == output;
    }
}
