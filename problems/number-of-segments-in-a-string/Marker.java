import java.util.*;
class Marker {
    public int countSegments(String s) {
        int n = 0;
        boolean inSeg = false;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c != ' ') {
                if (!inSeg) {
                    n++;
                    inSeg = true;
                }
            } else {
                inSeg = false;
            }
        }
        return n;
    }
    public boolean isCorrect(String s, int output) {
        return output == countSegments(s);
    }
}
