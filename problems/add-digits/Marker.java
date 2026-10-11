class Marker {
    public int addDigits(int num) {
        if (num == 0) return 0;
        return 1 + (num - 1) % 9;
    }
    public boolean isCorrect(int num, int output) {
        return addDigits(num) == output;
    }
}
