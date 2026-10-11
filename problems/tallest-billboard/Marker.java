import java.util.*;
class Marker {
    public int tallestBillboard(int[] rods) {
        int sum = 0;
        for (int r : rods) sum += r;
        int[] dp = new int[sum + 1];
        Arrays.fill(dp, -1);
        dp[0] = 0;
        for (int x : rods) {
            int[] next = dp.clone();
            for (int d = 0; d <= sum; d++) {
                if (dp[d] < 0) continue;
                if (d + x <= sum) next[d + x] = Math.max(next[d + x], dp[d] + x);
                int nd = Math.abs(d - x);
                next[nd] = Math.max(next[nd], dp[d] + Math.max(0, x - d));
            }
            dp = next;
        }
        return dp[0];
    }
    public boolean isCorrect(int[] rods, int output) {
        return output == tallestBillboard(rods);
    }
}
