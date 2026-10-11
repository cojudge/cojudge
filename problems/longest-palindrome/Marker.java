import java.util.*;
class Marker {
    public int longestPalindrome(String s) {
        int[] cnt = new int[128];
        for (int i = 0; i < s.length(); i++) cnt[s.charAt(i)]++;
        int len = 0;
        boolean odd = false;
        for (int c : cnt) {
            len += (c / 2) * 2;
            if (c % 2 == 1) odd = true;
        }
        return odd ? len + 1 : len;
    }
    public boolean isCorrect(String s, int output) {
        return longestPalindrome(s) == output;
    }
}
