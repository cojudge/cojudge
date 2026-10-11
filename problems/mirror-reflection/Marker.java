class Marker {
    public int mirrorReflection(int p, int q) {
        while (p % 2 == 0 && q % 2 == 0) { p /= 2; q /= 2; }
        if (p % 2 == 0) return 2;
        if (q % 2 == 0) return 0;
        return 1;
    }
    public boolean isCorrect(int p, int q, int output) {
        return mirrorReflection(p, q) == output;
    }
}
