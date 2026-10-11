import java.util.*;
class Marker {
    public int cherryPickup(int[][] grid) {
        int n = grid.length;
        int N = 2 * n - 1;
        int NEG = Integer.MIN_VALUE / 4;
        int[][][] dp = new int[N][n][n];
        for (int t = 0; t < N; t++)
            for (int i = 0; i < n; i++) Arrays.fill(dp[t][i], NEG);
        if (grid[0][0] == -1) return 0;
        dp[0][0][0] = grid[0][0];
        for (int t = 1; t < N; t++) {
            for (int r1 = 0; r1 < n; r1++) {
                for (int r2 = 0; r2 < n; r2++) {
                    int c1 = t - r1, c2 = t - r2;
                    if (c1 < 0 || c1 >= n || c2 < 0 || c2 >= n) continue;
                    if (grid[r1][c1] == -1 || grid[r2][c2] == -1) continue;
                    int best = NEG;
                    for (int dr1 = 0; dr1 <= 1; dr1++)
                        for (int dr2 = 0; dr2 <= 1; dr2++) {
                            int pr1 = r1 - dr1, pr2 = r2 - dr2;
                            if (pr1 < 0 || pr2 < 0) continue;
                            best = Math.max(best, dp[t-1][pr1][pr2]);
                        }
                    if (best == NEG) continue;
                    int add = grid[r1][c1];
                    if (r1 != r2) add += grid[r2][c2];
                    dp[t][r1][r2] = best + add;
                }
            }
        }
        int ans = dp[N-1][n-1][n-1];
        return Math.max(ans, 0);
    }
    public boolean isCorrect(int[][] grid, int output) {
        return cherryPickup(grid) == output;
    }
}
