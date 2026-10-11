import java.util.*;
class Marker {
    public String shortestSuperstring(String[] words) {
        int n = words.length;
        if (n == 1) return words[0];
        int[][] ov = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i == j) continue;
                int m = Math.min(words[i].length(), words[j].length());
                for (int k = m; k > 0; k--) {
                    if (words[i].regionMatches(words[i].length() - k, words[j], 0, k)) {
                        ov[i][j] = k;
                        break;
                    }
                }
            }
        }
        int total = 1 << n;
        String[][] dp = new String[total][n];
        for (int i = 0; i < n; i++) {
            dp[1 << i][i] = words[i];
        }
        for (int mask = 1; mask < total; mask++) {
            for (int last = 0; last < n; last++) {
                if ((mask & (1 << last)) == 0 || dp[mask][last] == null) continue;
                for (int nxt = 0; nxt < n; nxt++) {
                    if ((mask & (1 << nxt)) != 0) continue;
                    String cand = dp[mask][last] + words[nxt].substring(ov[last][nxt]);
                    int nm = mask | (1 << nxt);
                    if (dp[nm][nxt] == null || cand.length() < dp[nm][nxt].length()
                            || (cand.length() == dp[nm][nxt].length() && cand.compareTo(dp[nm][nxt]) < 0)) {
                        dp[nm][nxt] = cand;
                    }
                }
            }
        }
        String best = null;
        int full = total - 1;
        for (int i = 0; i < n; i++) {
            if (dp[full][i] == null) continue;
            if (best == null || dp[full][i].length() < best.length()
                    || (dp[full][i].length() == best.length() && dp[full][i].compareTo(best) < 0)) {
                best = dp[full][i];
            }
        }
        return best;
    }
    public boolean isCorrect(String[] words, String output) {
        if (output == null) return false;
        for (String w : words) {
            if (!output.contains(w)) return false;
        }
        return output.length() == shortestSuperstring(words).length();
    }
}
