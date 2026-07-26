class Marker {
    public int maxProfit(int[] prices) {
        int hold = -prices[0];
        int sold = 0;
        int rest = 0;
        for (int i = 1; i < prices.length; i++) {
            int previousSold = sold;
            sold = hold + prices[i];
            hold = Math.max(hold, rest - prices[i]);
            rest = Math.max(rest, previousSold);
        }
        return Math.max(sold, rest);
    }

    public boolean isCorrect(int[] prices, int output) {
        return output == maxProfit(prices);
    }
}
