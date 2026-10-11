import java.util.*;
class Marker {
    public int maxVacationDays(int[][] flights, int[][] days) {
        int n = flights.length, k = days[0].length;
        final int NEG = Integer.MIN_VALUE / 2;
        int[] dp = new int[n];
        Arrays.fill(dp, NEG);
        for (int j = 0; j < n; j++)
            if (j == 0 || flights[0][j] == 1) dp[j] = days[j][0];
        for (int week = 1; week < k; week++) {
            int[] nd = new int[n];
            Arrays.fill(nd, NEG);
            for (int j = 0; j < n; j++)
                for (int i = 0; i < n; i++)
                    if (dp[i] != NEG && (i == j || flights[i][j] == 1))
                        nd[j] = Math.max(nd[j], dp[i] + days[j][week]);
            dp = nd;
        }
        int ans = 0;
        for (int v : dp) ans = Math.max(ans, v);
        return ans;
    }
    public boolean isCorrect(int[][] flights, int[][] days, int output) {
        return output == maxVacationDays(flights, days);
    }
}
