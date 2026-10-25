import java.util.*;
class Marker {
    public int strLength(String s) {
        int count = 0;
        for (int i = 0; i < s.length(); i++) count++;
        return count;
    }
    public boolean isCorrect(String s, int output) {
        return strLength(s) == output;
    }
}
