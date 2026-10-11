class Marker {
    public int trailingZeroes(int n) {
        int res = 0;
        while (n > 0) {
            n /= 5;
            res += n;
        }
        return res;
    }
    public boolean isCorrect(int n, int output) {
        return trailingZeroes(n) == output;
    }
}
