import java.util.*;
class Marker {
    public int minDeletionSize(String[] strs) {
        int w = strs[0].length();
        int[] dp = new int[w];
        Arrays.fill(dp, 1);
        for (int i = 0; i < w; i++) {
            for (int j = 0; j < i; j++) {
                boolean ok = true;
                for (String r : strs) {
                    if (r.charAt(j) > r.charAt(i)) {
                        ok = false;
                        break;
                    }
                }
                if (ok) dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        int keep = 0;
        for (int v : dp) keep = Math.max(keep, v);
        return w - keep;
    }
    public boolean isCorrect(String[] strs, int output) {
        return output == minDeletionSize(strs);
    }
}
