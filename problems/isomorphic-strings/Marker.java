import java.util.*;
class Marker {
    public boolean isIsomorphic(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] lastS = new int[256];
        int[] lastT = new int[256];
        Arrays.fill(lastS, -1);
        Arrays.fill(lastT, -1);
        for (int i = 0; i < s.length(); i++) {
            int a = s.charAt(i), b = t.charAt(i);
            if (lastS[a] != lastT[b]) return false;
            lastS[a] = i;
            lastT[b] = i;
        }
        return true;
    }
    public boolean isCorrect(String s, String t, boolean output) {
        return output == isIsomorphic(s, t);
    }
}
