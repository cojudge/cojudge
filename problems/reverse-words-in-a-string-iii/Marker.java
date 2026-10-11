import java.util.*;
class Marker {
    public String reverseWords(String s) {
        String[] parts = s.split(" ", -1);
        for (int i = 0; i < parts.length; i++)
            parts[i] = new StringBuilder(parts[i]).reverse().toString();
        return String.join(" ", parts);
    }
    public boolean isCorrect(String s, String output) {
        return reverseWords(s).equals(output);
    }
}
