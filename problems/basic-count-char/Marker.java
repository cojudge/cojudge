import java.util.*;
class Marker {
    public int countChar(String s, String ch) {
        char target = ch.charAt(0);
        int count = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == target) count++;
        }
        return count;
    }
    public boolean isCorrect(String s, String ch, int output) {
        return countChar(s, ch) == output;
    }
}
