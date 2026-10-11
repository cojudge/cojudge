import java.util.*;
class Marker {
    public int numMatchingSubseq(String s, String[] words) {
        int[][] next = buildNext(s);
        int count = 0;
        for (String w : words) {
            if (isSubseq(w, next)) count++;
        }
        return count;
    }
    private int[][] buildNext(String s) {
        int n = s.length();
        int[][] nxt = new int[n + 2][26];
        Arrays.fill(nxt[n], -1);
        Arrays.fill(nxt[n + 1], -1);
        for (int i = n - 1; i >= 0; i--) {
            System.arraycopy(nxt[i + 1], 0, nxt[i], 0, 26);
            nxt[i][s.charAt(i) - 'a'] = i;
        }
        return nxt;
    }
    private boolean isSubseq(String w, int[][] nxt) {
        int n = nxt.length - 2;
        int pos = 0;
        for (int k = 0; k < w.length(); k++) {
            int c = w.charAt(k) - 'a';
            if (pos > n) return false;
            int found = nxt[pos][c];
            if (found == -1) return false;
            pos = found + 1;
        }
        return true;
    }
    public boolean isCorrect(String s, String[] words, int output) {
        return numMatchingSubseq(s, words) == output;
    }
}
