class Marker {
    private boolean isMagic(int[][] g, int r, int c) {
        boolean[] seen = new boolean[10];
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                int v = g[r + i][c + j];
                if (v < 1 || v > 9 || seen[v]) return false;
                seen[v] = true;
            }
        }
        int s = g[r][c] + g[r][c+1] + g[r][c+2];
        if (s != 15) return false;
        for (int i = 0; i < 3; i++) {
            if (g[r+i][c] + g[r+i][c+1] + g[r+i][c+2] != 15) return false;
            if (g[r][c+i] + g[r+1][c+i] + g[r+2][c+i] != 15) return false;
        }
        if (g[r][c] + g[r+1][c+1] + g[r+2][c+2] != 15) return false;
        if (g[r][c+2] + g[r+1][c+1] + g[r+2][c] != 15) return false;
        return true;
    }
    public int numMagicSquaresInside(int[][] grid) {
        if (grid == null || grid.length < 3 || grid[0].length < 3) return 0;
        int R = grid.length, C = grid[0].length, ans = 0;
        for (int i = 0; i + 2 < R; i++)
            for (int j = 0; j + 2 < C; j++)
                if (isMagic(grid, i, j)) ans++;
        return ans;
    }
    public boolean isCorrect(int[][] grid, int output) {
        return numMagicSquaresInside(grid) == output;
    }
}
