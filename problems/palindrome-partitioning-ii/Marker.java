class Marker {
    public int minCut(String s) {
        int n = s.length();
        int[] cuts = new int[n + 1];
        for (int i = 0; i <= n; i++) cuts[i] = i - 1;
        for (int center = 0; center < n; center++) {
            expand(s, center, center, cuts);
            expand(s, center, center + 1, cuts);
        }
        return cuts[n];
    }
    private void expand(String s, int l, int r, int[] cuts) {
        int n = s.length();
        while (l >= 0 && r < n && s.charAt(l) == s.charAt(r)) {
            cuts[r + 1] = Math.min(cuts[r + 1], cuts[l] + 1);
            l--;
            r++;
        }
    }
    public boolean isCorrect(String s, int output) {
        return minCut(s) == output;
    }
}
