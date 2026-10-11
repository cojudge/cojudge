import java.util.*;
class Marker {
    public int nextGreaterElement(int n) {
        char[] d = String.valueOf(n).toCharArray();
        int i = d.length - 2;
        while (i >= 0 && d[i] >= d[i + 1]) i--;
        if (i < 0) return -1;
        int j = d.length - 1;
        while (d[j] <= d[i]) j--;
        char t = d[i]; d[i] = d[j]; d[j] = t;
        for (int l = i + 1, r = d.length - 1; l < r; l++, r--) {
            char c = d[l]; d[l] = d[r]; d[r] = c;
        }
        long v = Long.parseLong(new String(d));
        return v > Integer.MAX_VALUE ? -1 : (int) v;
    }
    public boolean isCorrect(int n, int output) {
        return output == nextGreaterElement(n);
    }
}
