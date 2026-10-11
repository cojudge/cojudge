import java.util.*;
class Marker {
    public int monotoneIncreasingDigits(int n) {
        char[] d = String.valueOf(n).toCharArray();
        int mark = d.length;
        for (int i = d.length - 1; i > 0; i--) {
            if (d[i] < d[i - 1]) {
                d[i - 1]--;
                mark = i;
            }
        }
        for (int i = mark; i < d.length; i++) d[i] = '9';
        return Integer.parseInt(new String(d));
    }
    public boolean isCorrect(int n, int output) {
        return monotoneIncreasingDigits(n) == output;
    }
}
