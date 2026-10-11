class Marker {
    public int matrixScore(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int ans = 0;
        for (int j = 0; j < n; j++) {
            int ones = 0;
            for (int i = 0; i < m; i++) {
                int flipped = grid[i][j] ^ (grid[i][0] == 0 ? 1 : 0);
                if (flipped == 1) ones++;
            }
            int best = Math.max(ones, m - ones);
            ans += best * (1 << (n - 1 - j));
        }
        return ans;
    }
    public boolean isCorrect(int[][] grid, int output) {
        return matrixScore(grid) == output;
    }
}
