class Marker {
    public int findLUSlength(String a, String b) {
        if (a.equals(b)) return -1;
        return Math.max(a.length(), b.length());
    }
    public boolean isCorrect(String a, String b, int output) {
        return output == findLUSlength(a, b);
    }
}
