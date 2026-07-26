class Marker {
    public int minCostClimbingStairs(int[] cost) {
        int twoBack = cost[0];
        int oneBack = cost[1];
        for (int i = 2; i < cost.length; i++) {
            int current = cost[i] + Math.min(twoBack, oneBack);
            twoBack = oneBack;
            oneBack = current;
        }
        return Math.min(twoBack, oneBack);
    }

    public boolean isCorrect(int[] cost, int output) {
        return output == minCostClimbingStairs(cost);
    }
}
