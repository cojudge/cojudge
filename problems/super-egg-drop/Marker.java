class Marker {
    public int superEggDrop(int k, int n) {
        int[] dp = new int[k + 1];
        int moves = 0;
        while (dp[k] < n) {
            moves++;
            for (int e = k; e >= 1; e--) {
                dp[e] = dp[e] + dp[e - 1] + 1;
            }
        }
        return moves;
    }
    public boolean isCorrect(int k, int n, int output) {
        return superEggDrop(k, n) == output;
    }
}
