import java.util.*;
class Marker {
    private long zeros(long x) {
        long c = 0;
        while (x > 0) {
            x /= 5;
            c += x;
        }
        return c;
    }
    public int preimageSizeFZF(int k) {
        long lo = 0, hi = 5L * (k + 1);
        while (lo < hi) {
            long mid = lo + (hi - lo) / 2;
            if (zeros(mid) < k) lo = mid + 1;
            else hi = mid;
        }
        return zeros(lo) == k ? 5 : 0;
    }
    public boolean isCorrect(int k, int output) {
        return preimageSizeFZF(k) == output;
    }
}
