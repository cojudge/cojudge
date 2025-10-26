import java.util.*;
class Marker {
    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};

    public int[][] pacificAtlantic(int[][] heights) {
        int m = heights.length;
        if (m == 0) return new int[0][0];
        int n = heights[0].length;
        boolean[][] pac = bfsFromEdges(heights, true);
        boolean[][] atl = bfsFromEdges(heights, false);
        List<int[]> res = new ArrayList<>();
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (pac[r][c] && atl[r][c]) res.add(new int[]{r,c});
            }
        }
        int[][] out = new int[res.size()][2];
        for (int i = 0; i < res.size(); i++) out[i] = res.get(i);
        return out;
    }

    private boolean[][] bfsFromEdges(int[][] h, boolean pacific) {
        int m = h.length, n = h[0].length;
        boolean[][] vis = new boolean[m][n];
        Deque<int[]> dq = new ArrayDeque<>();
        if (pacific) {
            for (int c = 0; c < n; c++) { vis[0][c] = true; dq.add(new int[]{0,c}); }
            for (int r = 0; r < m; r++) { vis[r][0] = true; dq.add(new int[]{r,0}); }
        } else {
            for (int c = 0; c < n; c++) { vis[m-1][c] = true; dq.add(new int[]{m-1,c}); }
            for (int r = 0; r < m; r++) { vis[r][n-1] = true; dq.add(new int[]{r,n-1}); }
        }
        while (!dq.isEmpty()) {
            int[] cur = dq.poll();
            int r = cur[0], c = cur[1];
            for (int[] d : DIRS) {
                int nr = r + d[0], nc = c + d[1];
                if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
                if (vis[nr][nc]) continue;
                if (h[nr][nc] >= h[r][c]) { // reverse flow: can climb to higher/equal
                    vis[nr][nc] = true;
                    dq.add(new int[]{nr,nc});
                }
            }
        }
        return vis;
    }

    public boolean isCorrect(int[][] heights, int[][] output) {
        int[][] expected = pacificAtlantic(heights);
        return sameSet(expected, output);
    }

    private boolean sameSet(int[][] a, int[][] b) {
        Comparator<int[]> comp = (x, y) -> x[0] != y[0] ? Integer.compare(x[0], y[0]) : Integer.compare(x[1], y[1]);
        List<int[]> la = new ArrayList<>();
        List<int[]> lb = new ArrayList<>();
        for (int[] x : a) la.add(new int[]{x[0], x[1]});
        for (int[] x : b) lb.add(new int[]{x[0], x[1]});
        la.sort(comp); lb.sort(comp);
        if (la.size() != lb.size()) return false;
        for (int i = 0; i < la.size(); i++) {
            if (la.get(i)[0] != lb.get(i)[0] || la.get(i)[1] != lb.get(i)[1]) return false;
        }
        return true;
    }
}
