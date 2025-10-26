import java.util.*;
class Marker {
    public boolean wordBreak(String s, java.util.List<String> wordDict) {
        Set<String> set = new HashSet<>(wordDict);
        int n = s.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;
        int maxL = 0; for (String w : set) maxL = Math.max(maxL, w.length());
        for (int i = 1; i <= n; i++) {
            for (int l = 1; l <= Math.min(i, maxL); l++) {
                if (!dp[i - l]) continue;
                if (set.contains(s.substring(i - l, i))) { dp[i] = true; break; }
            }
        }
        return dp[n];
    }
    public boolean isCorrect(String s, java.util.List<String> wordDict, boolean output) {
        return wordBreak(s, wordDict) == output;
    }
}
