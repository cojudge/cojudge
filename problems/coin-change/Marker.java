import java.util.*;
class Marker {
    public int coinChange(int[] coins, int amount) {
        if (amount == 0) return 0;
        int INF = amount + 1;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0;
        for (int c : coins) {
            for (int a = c; a <= amount; a++) {
                dp[a] = Math.min(dp[a], dp[a - c] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
    public boolean isCorrect(int[] coins, int amount, int output) {
        return coinChange(coins, amount) == output;
    }
}
