class Marker {
    public int consecutiveNumbersSum(int n) {
        int ans = 0;
        for (long k = 1; k * (k - 1) / 2 < n; k++) {
            long rem = n - k * (k - 1) / 2;
            if (rem % k == 0) ans++;
        }
        return ans;
    }
    public boolean isCorrect(int n, int output) {
        return consecutiveNumbersSum(n) == output;
    }
}
