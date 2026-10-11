class Marker {
    public int divide(int dividend, int divisor) {
        if (dividend == Integer.MIN_VALUE && divisor == -1) return Integer.MAX_VALUE;
        long a = Math.abs((long) dividend);
        long b = Math.abs((long) divisor);
        long q = 0;
        while (a >= b) {
            long chunk = b, mult = 1;
            while (a >= (chunk << 1)) {
                chunk <<= 1;
                mult <<= 1;
            }
            a -= chunk;
            q += mult;
        }
        if ((dividend < 0) ^ (divisor < 0)) q = -q;
        return (int) q;
    }
    public boolean isCorrect(int dividend, int divisor, int output) {
        return divide(dividend, divisor) == output;
    }
}
