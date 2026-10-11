import java.util.*;
class Marker {
    public int catAndMouse(int[][] graph) {
        int n = graph.length;
        int[][][] color = new int[n][n][2];
        int[][][] degree = new int[n][n][2];
        for (int m = 0; m < n; m++) {
            for (int c = 0; c < n; c++) {
                degree[m][c][0] = graph[m].length;
                int moves = 0;
                for (int x : graph[c]) if (x != 0) moves++;
                degree[m][c][1] = moves;
            }
        }
        ArrayDeque<int[]> q = new ArrayDeque<>();
        for (int c = 0; c < n; c++) {
            for (int t = 0; t < 2; t++) {
                color[0][c][t] = 1;
                q.add(new int[]{0, c, t});
                if (c > 0) {
                    color[c][c][t] = 2;
                    q.add(new int[]{c, c, t});
                }
            }
        }
        boolean[] inGraph = new boolean[n];
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            int m = cur[0], c = cur[1], t = cur[2];
            int res = color[m][c][t];
            if (t == 0) {
                for (int m2 = 0; m2 < n; m2++) {
                    boolean edge = false;
                    for (int x : graph[m2]) if (x == m) { edge = true; break; }
                    if (!edge) continue;
                    if (color[m2][c][1] != 0) continue;
                    if (res == 1) {
                        color[m2][c][1] = 1;
                        q.add(new int[]{m2, c, 1});
                    } else if (--degree[m2][c][1] == 0) {
                        color[m2][c][1] = 2;
                        q.add(new int[]{m2, c, 1});
                    }
                }
            } else {
                for (int c2 = 1; c2 < n; c2++) {
                    boolean edge = false;
                    for (int x : graph[c2]) if (x == c) { edge = true; break; }
                    if (!edge) continue;
                    if (color[m][c2][0] != 0) continue;
                    if (res == 2) {
                        color[m][c2][0] = 2;
                        q.add(new int[]{m, c2, 0});
                    } else if (--degree[m][c2][0] == 0) {
                        color[m][c2][0] = 1;
                        q.add(new int[]{m, c2, 0});
                    }
                }
            }
        }
        return color[1][2][0];
    }
    public boolean isCorrect(int[][] graph, int output) {
        return catAndMouse(graph) == output;
    }
}
