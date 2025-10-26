import java.util.*;
class Marker {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] cnt = new int[26];
        for (int i = 0; i < s.length(); i++) {
            char a = s.charAt(i), b = t.charAt(i);
            if (a >= 'a' && a <= 'z') cnt[a - 'a']++;
            else if (a >= 'A' && a <= 'Z') cnt[a - 'A']++;
            else return sortCheck(s, t);
            if (b >= 'a' && b <= 'z') cnt[b - 'a']--;
            else if (b >= 'A' && b <= 'Z') cnt[b - 'A']--;
            else return sortCheck(s, t);
        }
        for (int v : cnt) if (v != 0) return false;
        return true;
    }
    private boolean sortCheck(String s, String t) {
        char[] a = s.toCharArray();
        char[] b = t.toCharArray();
        Arrays.sort(a); Arrays.sort(b);
        return Arrays.equals(a, b);
    }
    public boolean isCorrect(String s, String t, boolean output) {
        return output == isAnagram(s, t);
    }
}
