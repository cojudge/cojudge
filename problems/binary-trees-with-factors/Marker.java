import java.util.*;
class Marker {
    private static final long MOD = 1000000007L;
    public int numFactoredBinaryTrees(int[] arr) {
        Arrays.sort(arr);
        Map<Integer, Integer> idx = new HashMap<>();
        for (int i = 0; i < arr.length; i++) idx.put(arr[i], i);
        long[] dp = new long[arr.length];
        Arrays.fill(dp, 1L);
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < i; j++) {
                if (arr[i] % arr[j] != 0) continue;
                int other = arr[i] / arr[j];
                Integer k = idx.get(other);
                if (k != null) dp[i] = (dp[i] + dp[j] * dp[k]) % MOD;
            }
        }
        long ans = 0;
        for (long v : dp) ans = (ans + v) % MOD;
        return (int) ans;
    }
    public boolean isCorrect(int[] arr, int output) {
        return numFactoredBinaryTrees(arr) == output;
    }
}
