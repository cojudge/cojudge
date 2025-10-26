class Marker {
    public int uniquePaths(int m, int n) {
        long res = 1;
        int k = Math.min(m - 1, n - 1);
        int a = m + n - 2;
        for (int i = 1; i <= k; i++) {
            res = res * (a - k + i) / i;
        }
        return (int) res;
    }
    public boolean isCorrect(int m, int n, int output) { return uniquePaths(m, n) == output; }
}
