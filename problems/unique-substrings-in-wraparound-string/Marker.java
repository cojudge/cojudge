class Marker {
    public int findSubstringInWraproundString(String s) {
        int[] best = new int[26];
        int run = 0;
        for (int i = 0; i < s.length(); i++) {
            if (i > 0 && (s.charAt(i) - s.charAt(i - 1) + 26) % 26 == 1) run++;
            else run = 1;
            int c = s.charAt(i) - 'a';
            if (run > best[c]) best[c] = run;
        }
        int ans = 0;
        for (int v : best) ans += v;
        return ans;
    }
    public boolean isCorrect(String s, int output) {
        return findSubstringInWraproundString(s) == output;
    }
}
