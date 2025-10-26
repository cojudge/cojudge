class Marker {
    // Treat input as unsigned for bit counting; Java's int is 32-bit two's complement
    public int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n &= (n - 1);
            count++;
        }
        return count;
    }

    public boolean isCorrect(int n, int output) {
        return hammingWeight(n) == output;
    }
}
