import java.util.*;
class Marker {
    public int lenLongestFibSubseq(int[] arr) {
        int n = arr.length;
        Map<Integer, Integer> idx = new HashMap<>();
        for (int i = 0; i < n; i++) idx.put(arr[i], i);
        int[][] dp = new int[n][n];
        int best = 0;
        for (int j = 0; j < n; j++) {
            for (int i = 0; i < j; i++) {
                int need = arr[j] - arr[i];
                Integer k = idx.get(need);
                dp[i][j] = (k != null && k < i) ? dp[k][i] + 1 : 2;
                best = Math.max(best, dp[i][j]);
            }
        }
        return best >= 3 ? best : 0;
    }
    public boolean isCorrect(int[] arr, int output) {
        return lenLongestFibSubseq(arr) == output;
    }
}
