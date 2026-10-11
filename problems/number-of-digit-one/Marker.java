class Marker {
    public int countDigitOne(int n) {
        long count = 0;
        for (long factor = 1; factor <= n; factor *= 10) {
            long lower = n % factor;
            long cur = (n / factor) % 10;
            long higher = n / (factor * 10);
            if (cur == 0) {
                count += higher * factor;
            } else if (cur == 1) {
                count += higher * factor + lower + 1;
            } else {
                count += (higher + 1) * factor;
            }
        }
        return (int) count;
    }

    public boolean isCorrect(int n, int output) {
        return output == countDigitOne(n);
    }
}
