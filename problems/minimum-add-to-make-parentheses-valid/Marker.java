import java.util.*;
class Marker {
    public int minAddToMakeValid(String s) {
        int open = 0, need = 0;
        for (char c : s.toCharArray()) {
            if (c == '(') open++;
            else {
                if (open > 0) open--;
                else need++;
            }
        }
        return open + need;
    }
    public boolean isCorrect(String s, int output) {
        return minAddToMakeValid(s) == output;
    }
}
