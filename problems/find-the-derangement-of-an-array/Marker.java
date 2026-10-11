import java.util.*;
class Marker {
    static final long MOD = 1000000007L;
    public int findDerangement(int n) {
        if (n == 1) return 0;
        long a = 1, b = 0;
        for (int i = 2; i <= n; i++) {
            long c = ((i - 1) * (a + b)) % MOD;
            a = b; b = c;
        }
        return (int) b;
    }
    public boolean isCorrect(int n, int output) {
        return findDerangement(n) == output;
    }
}
