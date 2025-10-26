import java.util.*;
class Marker {
    public String minWindow(String s, String t) {
        if (t.length() == 0 || s.length() < t.length()) return "";
        int[] need = new int[128];
        int required = 0;
        for (char c : t.toCharArray()) {
            if (need[c] == 0) required++;
            need[c]++;
        }
        int[] have = new int[128];
        int formed = 0;
        int l = 0, r = 0;
        int bestLen = Integer.MAX_VALUE, bestL = 0;
        while (r < s.length()) {
            char c = s.charAt(r);
            have[c]++;
            if (need[c] > 0 && have[c] == need[c]) formed++;
            while (l <= r && formed == required) {
                if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l; }
                char cl = s.charAt(l);
                have[cl]--;
                if (need[cl] > 0 && have[cl] < need[cl]) formed--;
                l++;
            }
            r++;
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestL, bestL + bestLen);
    }

    public boolean isCorrect(String s, String t, String output) {
        String expected = minWindow(s, t);
        return Objects.equals(expected, output);
    }
}
