class Marker {
    static final int MOD = 1337;
    private int powMod(int x, int e) {
        int r = 1 % MOD;
        x %= MOD;
        while (e > 0) {
            if ((e & 1) == 1) r = (r * x) % MOD;
            x = (x * x) % MOD;
            e >>= 1;
        }
        return r;
    }
    public int superPow(int a, int[] b) {
        int res = 1;
        for (int d : b) {
            res = powMod(res, 10);
            res = (res * powMod(a, d)) % MOD;
        }
        return res;
    }
    public boolean isCorrect(int a, int[] b, int output) {
        return output == superPow(a, b);
    }
}
