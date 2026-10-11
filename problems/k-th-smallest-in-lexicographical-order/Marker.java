import java.util.*;
class Marker {
    public int findKthNumber(int n, int k) {
        int cur = 1;
        k--;
        while (k > 0) {
            long steps = countSteps(n, cur, cur + 1);
            if (steps <= k) {
                cur++;
                k -= (int) steps;
            } else {
                cur *= 10;
                k--;
            }
        }
        return cur;
    }
    private long countSteps(int n, long p1, long p2) {
        long steps = 0;
        while (p1 <= n) {
            steps += Math.min((long)n + 1, p2) - p1;
            p1 *= 10;
            p2 *= 10;
        }
        return steps;
    }
    public boolean isCorrect(int n, int k, int output) {
        return findKthNumber(n, k) == output;
    }
}
