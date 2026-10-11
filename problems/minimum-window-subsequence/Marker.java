import java.util.*;
class Marker {
    public String minWindow(String s1, String s2) {
        int n = s1.length(), m = s2.length();
        int bestLen = Integer.MAX_VALUE, bestStart = -1;
        int i = 0;
        while (i < n) {
            int j = 0, k = i;
            while (k < n && j < m) {
                if (s1.charAt(k) == s2.charAt(j)) j++;
                k++;
            }
            if (j < m) break;
            int end = k - 1;
            j = m - 1;
            k = end;
            while (k >= i && j >= 0) {
                if (s1.charAt(k) == s2.charAt(j)) j--;
                k--;
            }
            int start = k + 1;
            int len = end - start + 1;
            if (len < bestLen) { bestLen = len; bestStart = start; }
            i = start + 1;
        }
        return bestStart == -1 ? "" : s1.substring(bestStart, bestStart + bestLen);
    }
    public boolean isCorrect(String s1, String s2, String output) {
        return minWindow(s1, s2).equals(output);
    }
}
