import java.util.*;
class Marker {
    public String toUpper(String s) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c >= 'a' && c <= 'z') c = (char) (c - 32);
            sb.append(c);
        }
        return sb.toString();
    }
    public boolean isCorrect(String s, String output) {
        return toUpper(s).equals(output);
    }
}
