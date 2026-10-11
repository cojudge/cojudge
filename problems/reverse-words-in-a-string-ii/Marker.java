import java.util.*;
class Marker {
    public String reverseWords(String s) {
        if (s == null || s.length() == 0) return s;
        String[] words = s.split(" ", -1);
        for (int i = 0, j = words.length - 1; i < j; i++, j--) {
            String t = words[i];
            words[i] = words[j];
            words[j] = t;
        }
        return String.join(" ", words);
    }
    public boolean isCorrect(String s, String output) {
        return reverseWords(s).equals(output);
    }
}
