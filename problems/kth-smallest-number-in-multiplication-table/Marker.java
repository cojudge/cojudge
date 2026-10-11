import java.util.*;
class Marker {
    public int findKthNumber(int m, int n, int k) {
        int lo = 1, hi = m * n;
        // hi may overflow for 30000*30000=9e8 fits int
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            int cnt = 0;
            int rows = Math.min(m, mid);
            for (int i = 1; i <= rows; i++) {
                cnt += Math.min(n, mid / i);
            }
            if (cnt >= k) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
    public boolean isCorrect(int m, int n, int k, int output) {
        return findKthNumber(m, n, k) == output;
    }
}
