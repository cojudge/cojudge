import java.util.*;
class Marker {
    public String customSortString(String order, String s) {
        int[] cnt = new int[26];
        for (char c : s.toCharArray()) cnt[c - 'a']++;
        StringBuilder sb = new StringBuilder();
        for (char c : order.toCharArray()) {
            while (cnt[c - 'a']-- > 0) sb.append(c);
        }
        for (int i = 0; i < 26; i++) {
            while (cnt[i]-- > 0) sb.append((char) ('a' + i));
        }
        return sb.toString();
    }
    public boolean isCorrect(String order, String s, String output) {
        if (output == null || output.length() != s.length()) return false;
        int[] a = new int[26];
        int[] b = new int[26];
        for (char c : s.toCharArray()) a[c - 'a']++;
        for (char c : output.toCharArray()) {
            if (c < 'a' || c > 'z') return false;
            b[c - 'a']++;
        }
        if (!Arrays.equals(a, b)) return false;
        int[] rank = new int[26];
        Arrays.fill(rank, -1);
        for (int i = 0; i < order.length(); i++) rank[order.charAt(i) - 'a'] = i;
        int lastSeen = -1;
        int[] firstPos = new int[26];
        int[] lastPos = new int[26];
        Arrays.fill(firstPos, -1);
        for (int i = 0; i < output.length(); i++) {
            int ch = output.charAt(i) - 'a';
            if (firstPos[ch] == -1) firstPos[ch] = i;
            lastPos[ch] = i;
        }
        for (int i = 0; i < order.length(); i++) {
            for (int j = i + 1; j < order.length(); j++) {
                int x = order.charAt(i) - 'a';
                int y = order.charAt(j) - 'a';
                if (a[x] > 0 && a[y] > 0) {
                    if (lastPos[x] >= firstPos[y]) return false;
                }
            }
        }
        return true;
    }
}
