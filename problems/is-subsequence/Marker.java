import java.util.*;
class Marker {
    public boolean isSubsequence(String s, String t) {
        int i = 0;
        for (int j = 0; j < t.length() && i < s.length(); j++) {
            if (s.charAt(i) == t.charAt(j)) i++;
        }
        return i == s.length();
    }
    public boolean isCorrect(String s, String t, boolean output) {
        return output == isSubsequence(s, t);
    }
}
