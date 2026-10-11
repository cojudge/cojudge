class Marker {
    public String encode(String s) {
        int n = s.length();
        String[][] dp = new String[n][n];
        for (int len = 1; len <= n; len++) {
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                dp[i][j] = s.substring(i, j + 1);
                for (int k = i; k < j; k++) {
                    if (dp[i][k].length() + dp[k + 1][j].length() < dp[i][j].length())
                        dp[i][j] = dp[i][k] + dp[k + 1][j];
                }
                String sub = s.substring(i, j + 1);
                int idx = (sub + sub).indexOf(sub, 1);
                if (idx < sub.length()) {
                    int rep = sub.length() / idx;
                    String cand = rep + "[" + dp[i][i + idx - 1] + "]";
                    if (cand.length() < dp[i][j].length()) dp[i][j] = cand;
                }
            }
        }
        return dp[0][n - 1];
    }
    public boolean isCorrect(String s, String output) {
        if (output.length() != encode(s).length()) return false;
        return decode(output).equals(s);
    }
    private String decode(String t) {
        int[] pos = new int[]{0};
        return dec(t, pos);
    }
    private String dec(String t, int[] pos) {
        StringBuilder sb = new StringBuilder();
        int n = t.length();
        while (pos[0] < n && t.charAt(pos[0]) != ']') {
            char c = t.charAt(pos[0]);
            if (Character.isDigit(c)) {
                int k = 0;
                while (pos[0] < n && Character.isDigit(t.charAt(pos[0]))) k = k * 10 + (t.charAt(pos[0]++) - '0');
                pos[0]++;
                String inner = dec(t, pos);
                pos[0]++;
                for (int i = 0; i < k; i++) sb.append(inner);
            } else {
                sb.append(c);
                pos[0]++;
            }
        }
        return sb.toString();
    }
}
