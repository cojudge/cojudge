class Marker {
    public int[] numberOfLines(int[] widths, String s) {
        if (s == null || s.isEmpty()) return new int[]{0, 0};
        int lines = 1, cur = 0;
        for (char c : s.toCharArray()) {
            int w = widths[c - 'a'];
            if (cur + w > 100) { lines++; cur = w; }
            else cur += w;
        }
        return new int[]{lines, cur};
    }
    public boolean isCorrect(int[] widths, String s, int[] output) {
        if (output == null || output.length != 2) return false;
        int[] e = numberOfLines(widths, s);
        return e[0] == output[0] && e[1] == output[1];
    }
}
