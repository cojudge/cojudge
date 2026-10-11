import java.util.*;
class Marker {
    public int containVirus(int[][] isInfected) {
        int m = isInfected.length, n = isInfected[0].length;
        int ans = 0;
        int[][] g = new int[m][n];
        for (int i = 0; i < m; i++) g[i] = isInfected[i].clone();
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (true) {
            boolean[][] vis = new boolean[m][n];
            List<List<int[]>> areas = new ArrayList<>();
            List<Set<Integer>> bounds = new ArrayList<>();
            List<Integer> walls = new ArrayList<>();
            for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) {
                if (g[i][j] == 1 && !vis[i][j]) {
                    List<int[]> area = new ArrayList<>();
                    Set<Integer> bound = new HashSet<>();
                    int w = 0;
                    Queue<int[]> q = new LinkedList<>();
                    q.add(new int[]{i,j}); vis[i][j] = true;
                    while (!q.isEmpty()) {
                        int[] cur = q.poll();
                        area.add(cur);
                        for (int[] d : dirs) {
                            int x = cur[0]+d[0], y = cur[1]+d[1];
                            if (x<0||x>=m||y<0||y>=n) continue;
                            if (g[x][y] == -1) continue;
                            if (g[x][y] == 0) { w++; bound.add(x*n+y); }
                            else if (g[x][y] == 1 && !vis[x][y]) { vis[x][y]=true; q.add(new int[]{x,y}); }
                        }
                    }
                    areas.add(area); bounds.add(bound); walls.add(w);
                }
            }
            if (areas.isEmpty()) break;
            int idx = 0;
            for (int i = 1; i < bounds.size(); i++) {
                if (bounds.get(i).size() > bounds.get(idx).size()) idx = i;
            }
            if (bounds.get(idx).isEmpty()) break;
            ans += walls.get(idx);
            for (int k = 0; k < areas.size(); k++) {
                if (k == idx) {
                    for (int[] c : areas.get(k)) g[c[0]][c[1]] = -1;
                } else {
                    for (int code : bounds.get(k)) g[code/n][code%n] = 1;
                }
            }
        }
        return ans;
    }
    public boolean isCorrect(int[][] isInfected, int output) {
        int[][] copy = new int[isInfected.length][];
        for (int i = 0; i < isInfected.length; i++) copy[i] = isInfected[i].clone();
        return containVirus(copy) == output;
    }
}
