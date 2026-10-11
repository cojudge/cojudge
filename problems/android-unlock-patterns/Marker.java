class Marker {
    private int[][] skip = new int[10][10];
    public int numberOfPatterns(int m, int n) {
        skip[1][3] = skip[3][1] = 2;
        skip[1][7] = skip[7][1] = 4;
        skip[3][9] = skip[9][3] = 6;
        skip[7][9] = skip[9][7] = 8;
        skip[1][9] = skip[9][1] = skip[2][8] = skip[8][2] = skip[3][7] = skip[7][3] = skip[4][6] = skip[6][4] = 5;
        boolean[] used = new boolean[10];
        return dfs(used, 1, 0, m, n) * 4 + dfs(used, 2, 0, m, n) * 4 + dfs(used, 5, 0, m, n);
    }
    private int dfs(boolean[] used, int cur, int len, int m, int n) {
        int total = 0;
        used[cur] = true;
        len++;
        if (len >= m) total++;
        if (len < n) {
            for (int nxt = 1; nxt <= 9; nxt++) {
                if (!used[nxt] && (skip[cur][nxt] == 0 || used[skip[cur][nxt]])) {
                    total += dfs(used, nxt, len, m, n);
                }
            }
        }
        used[cur] = false;
        return total;
    }
    public boolean isCorrect(int m, int n, int output) {
        return numberOfPatterns(m, n) == output;
    }
}
