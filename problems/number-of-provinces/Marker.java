class Marker {
    public int findCircleNum(int[][] isConnected) {
        int n = isConnected.length;
        boolean[] vis = new boolean[n];
        int cnt = 0;
        for (int i = 0; i < n; i++) if (!vis[i]) { cnt++; dfs(isConnected, vis, i); }
        return cnt;
    }
    private void dfs(int[][] g, boolean[] vis, int u) {
        vis[u] = true;
        for (int v = 0; v < g.length; v++) if (g[u][v] == 1 && !vis[v]) dfs(g, vis, v);
    }
    public boolean isCorrect(int[][] isConnected, int output) {
        return findCircleNum(isConnected) == output;
    }
}
