import java.util.*;
class Marker {
    public String reverseText(String s) {
        StringBuilder sb = new StringBuilder();
        for (int i = s.length() - 1; i >= 0; i--) sb.append(s.charAt(i));
        return sb.toString();
    }
    public boolean isCorrect(String s, String output) {
        return reverseText(s).equals(output);
    }
}
