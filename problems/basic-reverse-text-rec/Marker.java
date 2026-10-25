import java.util.*;
class Marker {
    public String reverseTextRec(String s) {
        if (s.length() <= 1) return s;
        return reverseTextRec(s.substring(1)) + s.charAt(0);
    }
    public boolean isCorrect(String s, String output) {
        return reverseTextRec(s).equals(output);
    }
}
