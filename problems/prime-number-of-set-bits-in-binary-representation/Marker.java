class Marker {
    public int countPrimeSetBits(int left, int right) {
        int ans = 0;
        for (int x = left; x <= right; x++) {
            int bits = Integer.bitCount(x);
            if (isPrime(bits)) ans++;
        }
        return ans;
    }
    private boolean isPrime(int n) {
        if (n < 2) return false;
        for (int d = 2; d * d <= n; d++) if (n % d == 0) return false;
        return true;
    }
    public boolean isCorrect(int left, int right, int output) {
        return output == countPrimeSetBits(left, right);
    }
}
