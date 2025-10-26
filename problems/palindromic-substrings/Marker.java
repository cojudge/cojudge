class Marker {
    public int countSubstrings(String s) {
        int n = s.length();
        int count = 0;
        for (int i = 0; i < n; i++) {
            count += expand(s, i, i);
            count += expand(s, i, i + 1);
        }
        return count;
    }
    private int expand(String s, int l, int r) {
        int c = 0;
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { c++; l--; r++; }
        return c;
    }
    public boolean isCorrect(String s, int output) {
        return output == countSubstrings(s);
    }
}
