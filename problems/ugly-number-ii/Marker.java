class Marker {
    public int nthUglyNumber(int n) {
        int[] ugly = new int[n];
        ugly[0] = 1;
        int i2 = 0, i3 = 0, i5 = 0;
        for (int i = 1; i < n; i++) {
            int next = Math.min(ugly[i2] * 2, Math.min(ugly[i3] * 3, ugly[i5] * 5));
            ugly[i] = next;
            if (next == ugly[i2] * 2) i2++;
            if (next == ugly[i3] * 3) i3++;
            if (next == ugly[i5] * 5) i5++;
        }
        return ugly[n - 1];
    }
    public boolean isCorrect(int n, int output) {
        return nthUglyNumber(n) == output;
    }
}
