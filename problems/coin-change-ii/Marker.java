class Marker {
    public int change(int amount, int[] coins) {
        int[] combinations = new int[amount + 1];
        combinations[0] = 1;
        for (int coin : coins) {
            for (int value = coin; value <= amount; value++) {
                combinations[value] += combinations[value - coin];
            }
        }
        return combinations[amount];
    }

    public boolean isCorrect(int amount, int[] coins, int output) {
        return output == change(amount, coins);
    }
}
