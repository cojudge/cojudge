class Marker {
    public boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }

    public boolean isCorrect(int n, boolean output) {
        return output == isPowerOfTwo(n);
    }
}
