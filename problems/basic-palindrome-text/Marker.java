import java.util.*;
class Marker {
    public boolean isPalindromeText(String s) {
        int n = s.length();
        for (int i = 0; i < n / 2; i++) {
            if (s.charAt(i) != s.charAt(n - 1 - i)) return false;
        }
        return true;
    }
    public boolean isCorrect(String s, boolean output) {
        return isPalindromeText(s) == output;
    }
}
