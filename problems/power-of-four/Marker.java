class Marker {
    public boolean isPowerOfFour(int n) {
        return n > 0 && (n & (n - 1)) == 0 && (n - 1) % 3 == 0;
    }
    public boolean isCorrect(int n, boolean output) {
        return isPowerOfFour(n) == output;
    }
}
