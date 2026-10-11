class Marker {
    static final int MOD = 1000000007;
    public int nthMagicalNumber(int n, int a, int b) {
        long l = lcm(a, b);
        long lo = 1, hi = (long) n * Math.min(a, b);
        while (lo < hi) {
            long mid = (lo + hi) / 2;
            if (mid / a + mid / b - mid / l >= n) hi = mid;
            else lo = mid + 1;
        }
        return (int) (lo % MOD);
    }
    private long gcd(long x, long y) {
        return y == 0 ? x : gcd(y, x % y);
    }
    private long lcm(long x, long y) {
        return x / gcd(x, y) * y;
    }
    public boolean isCorrect(int n, int a, int b, int output) {
        return nthMagicalNumber(n, a, b) == output;
    }
}
