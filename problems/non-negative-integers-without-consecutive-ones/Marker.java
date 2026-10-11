class Marker {
    public int findIntegers(int n) {
        int[] f = new int[32];
        f[0] = 1; f[1] = 2;
        for (int i = 2; i < 32; i++) f[i] = f[i-1] + f[i-2];
        int ans = 0, prev = 0;
        for (int k = 30; k >= 0; k--) {
            if (((n >> k) & 1) == 1) {
                ans += f[k];
                if (prev == 1) return ans;
                prev = 1;
            } else prev = 0;
        }
        return ans + 1;
    }
    public boolean isCorrect(int n, int output) {
        return output == findIntegers(n);
    }
}
