import java.util.*;
class Marker {
    public int stoneGameII(int[] piles) {
        int n = piles.length;
        int[] suffix = new int[n + 1];
        for (int i = n - 1; i >= 0; i--) {
            suffix[i] = suffix[i + 1] + piles[i];
        }
        int[][] dp = new int[n + 1][n + 1];
        for (int i = n - 1; i >= 0; i--) {
            for (int m = 1; m <= n; m++) {
                if (2 * m >= n - i) {
                    dp[i][m] = suffix[i];
                } else {
                    int best = 0;
                    for (int x = 1; x <= 2 * m; x++) {
                        best = Math.max(best, suffix[i] - dp[i + x][Math.max(m, x)]);
                    }
                    dp[i][m] = best;
                }
            }
        }
        return dp[0][1];
    }
    public boolean isCorrect(int[] piles, int output) {
        return stoneGameII(piles) == output;
    }
}