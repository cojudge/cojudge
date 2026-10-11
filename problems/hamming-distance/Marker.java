class Marker {
    public int hammingDistance(int x, int y) {
        return Integer.bitCount(x ^ y);
    }
    public boolean isCorrect(int x, int y, int output) {
        return hammingDistance(x, y) == output;
    }
}
