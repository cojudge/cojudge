import java.util.*;
class Marker {
    static final int MOD = 1000000007;
    public int knightDialer(int n) {
        int[][] moves = {{4,6},{6,8},{7,9},{4,8},{3,9,0},{},{1,7,0},{2,6},{1,3},{2,4}};
        long[] dp = new long[10];
        Arrays.fill(dp, 1);
        for (int step = 1; step < n; step++) {
            long[] ndp = new long[10];
            for (int d = 0; d < 10; d++) {
                for (int nb : moves[d]) ndp[nb] = (ndp[nb] + dp[d]) % MOD;
            }
            dp = ndp;
        }
        long ans = 0;
        for (long v : dp) ans = (ans + v) % MOD;
        return (int) ans;
    }
    public boolean isCorrect(int n, int output) {
        return knightDialer(n) == output;
    }
}
