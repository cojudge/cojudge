import java.util.*;
class Marker {
    public boolean canTransform(String start, String end) {
        int n = start.length();
        if (end.length() != n) return false;
        int i = 0, j = 0;
        while (i < n && j < n) {
            while (i < n && start.charAt(i) == 'X') i++;
            while (j < n && end.charAt(j) == 'X') j++;
            if (i == n && j == n) return true;
            if (i == n || j == n) return false;
            char a = start.charAt(i);
            char b = end.charAt(j);
            if (a != b) return false;
            if (a == 'L' && i < j) return false;
            if (a == 'R' && i > j) return false;
            i++;
            j++;
        }
        while (i < n) {
            if (start.charAt(i) != 'X') return false;
            i++;
        }
        while (j < n) {
            if (end.charAt(j) != 'X') return false;
            j++;
        }
        return true;
    }
    public boolean isCorrect(String start, String end, boolean output) {
        return canTransform(start, end) == output;
    }
}
