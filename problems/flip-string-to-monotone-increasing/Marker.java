import java.util.*;
class Marker {
    public int minFlipsMonoIncr(String s) {
        int ones = 0, flips = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '1') ones++;
            else flips = Math.min(flips + 1, ones);
        }
        return flips;
    }
    public boolean isCorrect(String s, int output) {
        return minFlipsMonoIncr(s) == output;
    }
}
