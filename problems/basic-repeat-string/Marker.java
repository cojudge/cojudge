import java.util.*;
class Marker {
    public String repeatString(String s, int k) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < k; i++) sb.append(s);
        return sb.toString();
    }
    public boolean isCorrect(String s, int k, String output) {
        return repeatString(s, k).equals(output);
    }
}
