import java.util.*;
class Marker {
    public int leastOpsExpressTarget(int x, int target) {
        Map<Long, Long> memo = new HashMap<>();
        return (int) solve(x, target, memo);
    }
    private long solve(int x, long v, Map<Long, Long> memo) {
        if (memo.containsKey(v)) return memo.get(v);
        long best;
        if (x >= v) {
            best = Math.min(v * 2 - 1, 2L * (x - v));
        } else {
            int k = 2;
            long y = (long) x * x;
            while (y < v) {
                y *= x;
                k++;
            }
            best = (k - 1) + solve(x, v - y / x, memo);
            if (y - v < v) best = Math.min(best, k + solve(x, y - v, memo));
        }
        memo.put(v, best);
        return best;
    }
    public boolean isCorrect(int x, int target, int output) {
        return output == leastOpsExpressTarget(x, target);
    }
}
