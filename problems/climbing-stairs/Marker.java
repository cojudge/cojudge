class Marker {
    public int climbStairs(int n) {
        if (n <= 2) return Math.max(1, n);
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }

    public boolean isCorrect(int n, int output) {
        return climbStairs(n) == output;
    }
}
