import java.util.*;
class Marker {
    public int firstUniqChar(String s) {
        int[] cnt = new int[26];
        for (int i = 0; i < s.length(); i++) cnt[s.charAt(i) - 'a']++;
        for (int i = 0; i < s.length(); i++) {
            if (cnt[s.charAt(i) - 'a'] == 1) return i;
        }
        return -1;
    }
    public boolean isCorrect(String s, int output) {
        return output == firstUniqChar(s);
    }
}
