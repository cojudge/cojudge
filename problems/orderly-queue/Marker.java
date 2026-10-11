import java.util.*;
class Marker {
    public String orderlyQueue(String s, int k) {
        if (k > 1) {
            char[] c = s.toCharArray();
            Arrays.sort(c);
            return new String(c);
        }
        String best = s;
        for (int i = 1; i < s.length(); i++) {
            String rot = s.substring(i) + s.substring(0, i);
            if (rot.compareTo(best) < 0) best = rot;
        }
        return best;
    }
    public boolean isCorrect(String s, int k, String output) {
        return orderlyQueue(s, k).equals(output);
    }
}
