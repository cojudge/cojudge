import java.util.*;
class Marker {
    public String strWithout3a3b(int a, int b) {
        StringBuilder sb = new StringBuilder();
        int ca = a;
        int cb = b;
        while (ca > 0 || cb > 0) {
            boolean writeA;
            int n = sb.length();
            if (n >= 2 && sb.charAt(n - 1) == sb.charAt(n - 2)) {
                writeA = sb.charAt(n - 1) == 'b';
            } else {
                writeA = ca >= cb;
            }
            if (writeA) {
                if (ca == 0) { sb.append('b'); cb--; }
                else { sb.append('a'); ca--; }
            } else {
                if (cb == 0) { sb.append('a'); ca--; }
                else { sb.append('b'); cb--; }
            }
        }
        return sb.toString();
    }
    public boolean isCorrect(int a, int b, String output) {
        if (output == null) return false;
        if (output.length() != a + b) return false;
        int ca = 0;
        int cb = 0;
        for (int i = 0; i < output.length(); i++) {
            char c = output.charAt(i);
            if (c == 'a') ca++;
            else if (c == 'b') cb++;
            else return false;
        }
        if (ca != a || cb != b) return false;
        for (int i = 0; i + 2 < output.length(); i++) {
            char c0 = output.charAt(i);
            char c1 = output.charAt(i + 1);
            char c2 = output.charAt(i + 2);
            if (c0 == 'a' && c1 == 'a' && c2 == 'a') return false;
            if (c0 == 'b' && c1 == 'b' && c2 == 'b') return false;
        }
        return true;
    }
}
