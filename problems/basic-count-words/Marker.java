import java.util.*;
class Marker {
    public int countWords(String s) {
        String t = s.trim();
        if (t.isEmpty()) return 0;
        return t.split("\\s+").length;
    }
    public boolean isCorrect(String s, int output) {
        return countWords(s) == output;
    }
}
