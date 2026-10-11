import java.util.*;
class Marker {
    // Adaptation: the original LeetCode signature returns char; here we
    // return a one-character String so every language shares one type.
    public String findTheDifference(String s, String t) {
        int x = 0;
        for (int i = 0; i < s.length(); i++) x ^= s.charAt(i);
        for (int i = 0; i < t.length(); i++) x ^= t.charAt(i);
        return String.valueOf((char) x);
    }
    public boolean isCorrect(String s, String t, String output) {
        if (output == null) return false;
        return findTheDifference(s, t).equals(output);
    }
}
