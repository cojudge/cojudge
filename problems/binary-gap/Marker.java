class Marker {
    public int binaryGap(int n) {
        int prev = -1, best = 0, idx = 0;
        while (n > 0) {
            if ((n & 1) == 1) {
                if (prev != -1) best = Math.max(best, idx - prev);
                prev = idx;
            }
            n >>= 1;
            idx++;
        }
        return best;
    }
    public boolean isCorrect(int n, int output) {
        return binaryGap(n) == output;
    }
}
