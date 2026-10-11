import java.util.*;
class Marker {
    public int compress(String s) {
        if (s == null || s.isEmpty()) return 0;
        int n = s.length();
        int len = 0;
        int j = 0;
        while (j < n) {
            int k = j;
            while (k < n && s.charAt(k) == s.charAt(j)) k++;
            int count = k - j;
            len += 1;
            if (count > 1) len += String.valueOf(count).length();
            j = k;
        }
        return len;
    }
    public boolean isCorrect(String s, int output) {
        return compress(s) == output;
    }
}
