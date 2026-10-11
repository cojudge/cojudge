import java.util.*;
class Marker {
    public int mincostTickets(int[] days, int[] costs) {
        boolean[] travel = new boolean[366];
        for (int d : days) travel[d] = true;
        int[] dp = new int[366];
        for (int d = 1; d <= 365; d++) {
            if (!travel[d]) { dp[d] = dp[d - 1]; continue; }
            int one = dp[d - 1] + costs[0];
            int seven = dp[Math.max(0, d - 7)] + costs[1];
            int thirty = dp[Math.max(0, d - 30)] + costs[2];
            dp[d] = Math.min(one, Math.min(seven, thirty));
        }
        return dp[365];
    }
    public boolean isCorrect(int[] days, int[] costs, int output) {
        return mincostTickets(days, costs) == output;
    }
}
