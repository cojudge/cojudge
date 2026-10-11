class Marker {
    public int findComplement(int num) {
        long mask = 0;
        long t = num & 0xffffffffL;
        if (t == 0) return 1;
        while (t > 0) {
            mask = (mask << 1) | 1;
            t >>= 1;
        }
        return (int) (mask ^ (num & 0xffffffffL));
    }
    public boolean isCorrect(int num, int output) {
        return findComplement(num) == output;
    }
}
