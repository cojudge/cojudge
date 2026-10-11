import java.util.*;
class Marker {
    public int maximumSwap(int num) {
        char[] d = String.valueOf(num).toCharArray();
        int[] last = new int[10];
        for (int i = 0; i < d.length; i++) last[d[i]-'0'] = i;
        for (int i = 0; i < d.length; i++) {
            for (int v = 9; v > d[i]-'0'; v--) {
                if (last[v] > i) {
                    char t = d[i]; d[i] = d[last[v]]; d[last[v]] = t;
                    return Integer.parseInt(new String(d));
                }
            }
        }
        return num;
    }
    public boolean isCorrect(int num, int output) {
        return maximumSwap(num) == output;
    }
}
