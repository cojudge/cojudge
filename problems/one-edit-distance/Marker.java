class Marker {
    public boolean isOneEditDistance(String s, String t) {
        int m = s.length(), n = t.length();
        if (Math.abs(m - n) > 1) return false;
        if (m == n) {
            int diff = 0;
            for (int i = 0; i < m; i++) {
                if (s.charAt(i) != t.charAt(i)) {
                    diff++;
                    if (diff > 1) return false;
                }
            }
            return diff == 1;
        }
        String longer = m > n ? s : t;
        String shorter = m > n ? t : s;
        int i = 0, j = 0;
        boolean skipped = false;
        while (i < longer.length() && j < shorter.length()) {
            if (longer.charAt(i) == shorter.charAt(j)) { i++; j++; }
            else {
                if (skipped) return false;
                skipped = true;
                i++;
            }
        }
        return true;
    }
    public boolean isCorrect(String s, String t, boolean output) {
        return isOneEditDistance(s, t) == output;
    }
}
