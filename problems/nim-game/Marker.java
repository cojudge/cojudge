class Marker {
    public boolean canWinNim(int n) {
        return n % 4 != 0;
    }
    public boolean isCorrect(int n, boolean output) {
        return canWinNim(n) == output;
    }
}
