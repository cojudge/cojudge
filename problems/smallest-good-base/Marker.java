class Marker {
    public String smallestGoodBase(String n) {
        long N = Long.parseLong(n);
        int maxM = 0;
        long t = N;
        while (t > 1) { t >>= 1; maxM++; }
        for (int m = maxM; m >= 1; m--) {
            long lo = 2, hi = (long) Math.pow(N, 1.0 / m) + 1;
            if (hi < 2) hi = 2;
            if (hi > N - 1) hi = N - 1;
            while (lo <= hi) {
                long mid = lo + (hi - lo) / 2;
                int cmp = compareSum(mid, m, N);
                if (cmp == 0) return Long.toString(mid);
                else if (cmp < 0) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return Long.toString(N - 1);
    }
    // -1 if sum < N, 0 if equal, 1 if sum > N (with overflow treated as > N)
    private int compareSum(long base, int m, long N) {
        long sum = 1;
        long cur = 1;
        for (int i = 0; i < m; i++) {
            if (cur > N / base) return 1;
            cur *= base;
            if (sum > N - cur) {
                // sum + cur would exceed N; but check equality edge
                // if sum+cur > N -> greater
                return 1;
            }
            sum += cur;
            if (sum > N) return 1;
        }
        if (sum == N) return 0;
        return sum < N ? -1 : 1;
    }
    public boolean isCorrect(String n, String output) {
        return smallestGoodBase(n).equals(output);
    }
}
