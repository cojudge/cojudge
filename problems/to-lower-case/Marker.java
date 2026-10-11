import java.util.*;
class Marker {
    public String toLowerCase(String s) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c >= 'A' && c <= 'Z') sb.append((char)(c + 32));
            else sb.append(c);
        }
        return sb.toString();
    }
    public boolean isCorrect(String s, String output) {
        return toLowerCase(s).equals(output);
    }
}
