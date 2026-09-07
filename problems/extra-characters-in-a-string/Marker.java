import java.util.*;

class Marker {
    public int minExtraChar(String s, String[] dictionary) {
        int n = s.length();
        int[] dp = new int[n + 1];
        for (int i = 0; i <= n; i++) {
            dp[i] = n - i;
        }
        Set<String> words = new HashSet<>(Arrays.asList(dictionary));
        for (int i = n - 1; i >= 0; i--) {
            dp[i] = dp[i + 1] + 1;
            for (String word : words) {
                if (s.startsWith(word, i)) {
                    dp[i] = Math.min(dp[i], dp[i + word.length()]);
                }
            }
        }
        return dp[0];
    }

    public boolean isCorrect(String s, String[] dictionary, int output) {
        return minExtraChar(s, dictionary) == output;
    }
}