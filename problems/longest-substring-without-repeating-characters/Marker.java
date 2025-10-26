import java.util.*;
class Marker {
    public int lengthOfLongestSubstring(String s) {
        int n = s.length();
        int[] last = new int[256];
        Arrays.fill(last, -1);
        int left = 0, best = 0;
        for (int i = 0; i < n; i++) {
            char c = s.charAt(i);
            if (last[c] >= left) {
                left = last[c] + 1;
            }
            last[c] = i;
            best = Math.max(best, i - left + 1);
        }
        return best;
    }

    public boolean isCorrect(String s, int output) {
        return output == lengthOfLongestSubstring(s);
    }
}
