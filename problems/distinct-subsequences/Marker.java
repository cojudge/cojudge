class Marker {
    public int numDistinct(String s, String t) {
        if (t.length() > s.length()) return 0;

        long[] counts = new long[t.length() + 1];
        counts[0] = 1;
        for (int i = 0; i < s.length(); i++) {
            int last = Math.min(i + 1, t.length());
            for (int j = last; j >= 1; j--) {
                if (s.charAt(i) == t.charAt(j - 1)) {
                    counts[j] += counts[j - 1];
                }
            }
        }
        return (int) counts[t.length()];
    }

    public boolean isCorrect(String s, String t, int output) {
        return output == numDistinct(s, t);
    }
}
