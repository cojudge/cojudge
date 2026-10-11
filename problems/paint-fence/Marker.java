class Marker {
    public int numWays(int n, int k) {
        if (n == 0 || k == 0) return 0;
        if (n == 1) return k;
        if (n == 2) return k * k;
        if (k == 1) return 0;
        long same = k;
        long diff = (long) k * (k - 1);
        for (int i = 3; i <= n; i++) {
            long nsame = diff;
            long ndiff = (same + diff) * (k - 1);
            same = nsame;
            diff = ndiff;
        }
        return (int) (same + diff);
    }
    public boolean isCorrect(int n, int k, int output) {
        return output == numWays(n, k);
    }
}
