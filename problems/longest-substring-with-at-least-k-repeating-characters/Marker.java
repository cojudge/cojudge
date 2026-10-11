import java.util.*;
class Marker {
    public int longestSubstring(String s, int k) {
        return helper(s.toCharArray(), 0, s.length(), k);
    }
    private int helper(char[] a, int lo, int hi, int k) {
        if (hi - lo < k) return 0;
        int[] cnt = new int[26];
        for (int i = lo; i < hi; i++) cnt[a[i] - 'a']++;
        for (int i = lo; i < hi; i++) {
            if (cnt[a[i] - 'a'] < k) {
                int j = i + 1;
                while (j < hi && cnt[a[j] - 'a'] < k) j++;
                return Math.max(helper(a, lo, i, k), helper(a, j, hi, k));
            }
        }
        return hi - lo;
    }
    public boolean isCorrect(String s, int k, int output) {
        return output == longestSubstring(s, k);
    }
}
