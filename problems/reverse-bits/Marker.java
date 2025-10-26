class Marker {
    public int reverseBits(int n) {
        int res = 0;
        for (int i = 0; i < 32; i++) {
            res = (res << 1) | (n & 1);
            n >>>= 1;
        }
        return res;
    }

    public boolean isCorrect(int n, int output) {
        return reverseBits(n) == output;
    }
}
