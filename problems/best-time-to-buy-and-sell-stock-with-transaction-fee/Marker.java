import java.util.*;
class Marker {
    public int maxProfit(int[] prices, int fee) {
        if (prices.length == 0) return 0;
        long hold = -prices[0];
        long cash = 0;
        for (int i = 1; i < prices.length; i++) {
            long p = prices[i];
            long nh = Math.max(hold, cash - p);
            long nc = Math.max(cash, hold + p - fee);
            hold = nh; cash = nc;
        }
        return (int) cash;
    }
    public boolean isCorrect(int[] prices, int fee, int output) {
        return maxProfit(prices, fee) == output;
    }
}
