import java.util.*;
class Marker {
    public int nthSuperUglyNumber(int n, int[] primes) {
        int[] ugly = new int[n];
        ugly[0] = 1;
        int k = primes.length;
        int[] idx = new int[k];
        long[] next = new long[k];
        for (int j = 0; j < k; j++) next[j] = primes[j];
        for (int i = 1; i < n; i++) {
            long m = Long.MAX_VALUE;
            for (long v : next) m = Math.min(m, v);
            ugly[i] = (int) m;
            for (int j = 0; j < k; j++) {
                if (next[j] == m) {
                    idx[j]++;
                    next[j] = (long) ugly[idx[j]] * primes[j];
                }
            }
        }
        return ugly[n - 1];
    }
    public boolean isCorrect(int n, int[] primes, int output) {
        return nthSuperUglyNumber(n, primes) == output;
    }
}
