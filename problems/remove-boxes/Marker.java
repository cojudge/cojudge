class Marker {
    public int removeBoxes(int[] boxes) {
        int n = boxes.length;
        int[][][] memo = new int[n][n][n];
        return dfs(boxes, 0, n - 1, 0, memo);
    }
    private int dfs(int[] b, int l, int r, int k, int[][][] memo) {
        if (l > r) return 0;
        int origL = l, origK = k;
        while (l + 1 <= r && b[l + 1] == b[l]) { l++; k++; }
        if (memo[origL][r][origK] != 0) return memo[origL][r][origK];
        int best = (k + 1) * (k + 1) + dfs(b, l + 1, r, 0, memo);
        for (int m = l + 1; m <= r; m++) {
            if (b[m] == b[l]) {
                best = Math.max(best, dfs(b, l + 1, m - 1, 0, memo) + dfs(b, m, r, k + 1, memo));
            }
        }
        memo[origL][r][origK] = best;
        return best;
    }
    public boolean isCorrect(int[] boxes, int output) {
        return removeBoxes(boxes) == output;
    }
}
