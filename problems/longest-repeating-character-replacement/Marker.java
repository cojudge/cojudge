import java.util.*;
class Marker {
    public int characterReplacement(String s, int k) {
        int[] cnt = new int[26];
        int left = 0, maxCnt = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            int idx = s.charAt(right) - 'A';
            if (idx < 0 || idx >= 26) idx = Character.toUpperCase(s.charAt(right)) - 'A';
            cnt[idx]++;
            maxCnt = Math.max(maxCnt, cnt[idx]);
            while ((right - left + 1) - maxCnt > k) {
                int li = s.charAt(left) - 'A';
                if (li < 0 || li >= 26) li = Character.toUpperCase(s.charAt(left)) - 'A';
                cnt[li]--;
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }

    public boolean isCorrect(String s, int k, int output) {
        return output == characterReplacement(s, k);
    }
}
