import java.util.*;
class Marker {
    public int expressiveWords(String s, String[] words) {
        int ans = 0;
        for (String w : words) if (isStretchy(s, w)) ans++;
        return ans;
    }
    private boolean isStretchy(String s, String w) {
        int i = 0, j = 0;
        int n = s.length(), m = w.length();
        while (i < n && j < m) {
            char cs = s.charAt(i), cw = w.charAt(j);
            if (cs != cw) return false;
            int ni = i;
            while (ni < n && s.charAt(ni) == cs) ni++;
            int nj = j;
            while (nj < m && w.charAt(nj) == cw) nj++;
            int ls = ni - i, lw = nj - j;
            if (ls != lw && (ls < 3 || ls < lw)) return false;
            i = ni; j = nj;
        }
        return i == n && j == m;
    }
    public boolean isCorrect(String s, String[] words, int output) {
        return expressiveWords(s, words) == output;
    }
}
