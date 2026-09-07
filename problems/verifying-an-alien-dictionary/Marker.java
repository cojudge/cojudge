import java.util.*;
class Marker {
    public boolean isAlienSorted(String[] words, String order) {
        int[] rank = new int[26];
        for (int i = 0; i < order.length(); i++) rank[order.charAt(i) - 'a'] = i;
        for (int i = 0; i + 1 < words.length; i++) {
            if (!lessOrEqual(words[i], words[i+1], rank)) return false;
        }
        return true;
    }
    private boolean lessOrEqual(String a, String b, int[] rank) {
        int n = Math.min(a.length(), b.length());
        for (int i = 0; i < n; i++) {
            int ra = rank[a.charAt(i) - 'a'], rb = rank[b.charAt(i) - 'a'];
            if (ra < rb) return true;
            if (ra > rb) return false;
        }
        return a.length() <= b.length();
    }
    public boolean isCorrect(String[] words, String order, boolean output) {
        return isAlienSorted(words, order) == output;
    }
}
