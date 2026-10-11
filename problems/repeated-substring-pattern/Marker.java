class Marker {
    public boolean repeatedSubstringPattern(String s) {
        int n = s.length();
        for (int len = 1; len <= n / 2; len++) {
            if (n % len != 0) continue;
            String p = s.substring(0, len);
            boolean ok = true;
            for (int i = len; i < n; i += len) {
                if (!s.substring(i, i + len).equals(p)) { ok = false; break; }
            }
            if (ok) return true;
        }
        return false;
    }
    public boolean isCorrect(String s, boolean output) {
        return repeatedSubstringPattern(s) == output;
    }
}
