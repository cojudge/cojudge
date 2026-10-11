import java.util.*;
class Marker {
    public String convert(String s, int numRows) {
        if (numRows == 1 || s.length() <= numRows) return s;
        StringBuilder[] rows = new StringBuilder[numRows];
        for (int i = 0; i < numRows; i++) rows[i] = new StringBuilder();
        int cur = 0;
        boolean down = true;
        for (char c : s.toCharArray()) {
            rows[cur].append(c);
            if (cur == 0) down = true;
            else if (cur == numRows - 1) down = false;
            cur += down ? 1 : -1;
        }
        StringBuilder ans = new StringBuilder();
        for (StringBuilder r : rows) ans.append(r);
        return ans.toString();
    }
    public boolean isCorrect(String s, int numRows, String output) {
        return convert(s, numRows).equals(output);
    }
}
