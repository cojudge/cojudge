import java.util.*;
class Marker {
    public int repeatedStringMatch(String a, String b) {
        StringBuilder sb = new StringBuilder();
        int count = 0;
        while (sb.length() < b.length()) {
            sb.append(a);
            count++;
        }
        if (sb.indexOf(b) >= 0) return count;
        sb.append(a);
        count++;
        if (sb.indexOf(b) >= 0) return count;
        return -1;
    }
    public boolean isCorrect(String a, String b, int output) {
        return repeatedStringMatch(a, b) == output;
    }
}
