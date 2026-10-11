class Marker {
    public int[] shortestToChar(String s, String c) {
        char t = c.charAt(0);
        int n = s.length();
        int[] ans = new int[n];
        int prev = Integer.MIN_VALUE / 2;
        for (int i = 0; i < n; i++) {
            if (s.charAt(i) == t) prev = i;
            ans[i] = i - prev;
        }
        int next = Integer.MAX_VALUE / 2;
        for (int i = n - 1; i >= 0; i--) {
            if (s.charAt(i) == t) next = i;
            ans[i] = Math.min(ans[i], next - i);
        }
        return ans;
    }
    public boolean isCorrect(String s, String c, int[] output) {
        int[] e = shortestToChar(s, c);
        if (e.length != output.length) return false;
        for (int i = 0; i < e.length; i++) if (e[i] != output[i]) return false;
        return true;
    }
}
