class Marker {
    public int checkRecord(int n) {
        final int MOD = 1000000007;
        long[][] dp = new long[2][3];
        dp[0][0] = 1;
        for (int i = 0; i < n; i++) {
            long[][] ndp = new long[2][3];
            for (int a = 0; a < 2; a++) for (int l = 0; l < 3; l++) {
                long v = dp[a][l];
                if (v == 0) continue;
                ndp[a][0] = (ndp[a][0] + v) % MOD;
                if (a == 0) ndp[1][0] = (ndp[1][0] + v) % MOD;
                if (l < 2) ndp[a][l + 1] = (ndp[a][l + 1] + v) % MOD;
            }
            dp = ndp;
        }
        long ans = 0;
        for (int a = 0; a < 2; a++) for (int l = 0; l < 3; l++) ans = (ans + dp[a][l]) % MOD;
        return (int) ans;
    }
    public boolean isCorrect(int n, int output) {
        return checkRecord(n) == output;
    }
}
