import java.util.*;
class Marker {
    private static final int MOD = 1000000007;
    private int[][][] memo;
    private int m, n;
    private int dfs(int r, int c, int moves) {
        if (r < 0 || r >= m || c < 0 || c >= n) return 1;
        if (moves == 0) return 0;
        if (memo[r][c][moves] != -1) return memo[r][c][moves];
        long ans = 0;
        ans += dfs(r - 1, c, moves - 1);
        ans += dfs(r + 1, c, moves - 1);
        ans += dfs(r, c - 1, moves - 1);
        ans += dfs(r, c + 1, moves - 1);
        memo[r][c][moves] = (int) (ans % MOD);
        return memo[r][c][moves];
    }
    public int findPaths(int m, int n, int maxMove, int startRow, int startColumn) {
        this.m = m; this.n = n;
        memo = new int[m][n][maxMove + 1];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) Arrays.fill(memo[i][j], -1);
        return dfs(startRow, startColumn, maxMove);
    }
    public boolean isCorrect(int m, int n, int maxMove, int startRow, int startColumn, int output) {
        return output == findPaths(m, n, maxMove, startRow, startColumn);
    }
}
