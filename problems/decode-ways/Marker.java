class Marker {
    public int numDecodings(String s) {
        int n = s.length();
        if (n == 0 || s.charAt(0) == '0') return 0;
        int prev2 = 1; // dp[0]
        int prev1 = 1; // dp[1]
        for (int i = 1; i < n; i++) {
            int cur = 0;
            char c = s.charAt(i);
            if (c != '0') cur += prev1;
            int two = (s.charAt(i - 1) - '0') * 10 + (s.charAt(i) - '0');
            if (two >= 10 && two <= 26) cur += prev2;
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
    public boolean isCorrect(String s, int output) { return numDecodings(s) == output; }
}
