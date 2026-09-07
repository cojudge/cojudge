import java.util.*;
class Marker {
    public int lastStoneWeightII(int[] stones) {
        int total = 0;
        for (int s : stones) total += s;
        boolean[] dp = new boolean[total + 1];
        dp[0] = true;
        for (int s : stones) {
            for (int sum = total; sum >= s; sum--) {
                dp[sum] = dp[sum] || dp[sum - s];
            }
        }
        int best = 0;
        for (int sum = total / 2; sum >= 0; sum--) {
            if (dp[sum]) {
                best = sum;
                break;
            }
        }
        return total - 2 * best;
    }
    public boolean isCorrect(int[] stones, int output) {
        return lastStoneWeightII(stones) == output;
    }
}