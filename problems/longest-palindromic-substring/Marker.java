class Marker {
    public String longestPalindrome(String s) {
        if (s == null || s.length() < 2) return s;
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            int len1 = expand(s, i, i);
            int len2 = expand(s, i, i + 1);
            int len = Math.max(len1, len2);
            if (len > end - start + 1) {
                start = i - (len - 1) / 2;
                end = i + len / 2;
            }
        }
        return s.substring(start, end + 1);
    }
    private int expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
        return r - l - 1;
    }
    private boolean isPal(String x) {
        int i = 0, j = x.length() - 1;
        while (i < j) if (x.charAt(i++) != x.charAt(j--)) return false;
        return true;
    }
    public boolean isCorrect(String s, String output) {
        String expect = longestPalindrome(s);
        if (output == null) return expect == null;
        if (!s.contains(output)) return false;
        if (!isPal(output)) return false;
        return output.length() == expect.length();
    }
}
