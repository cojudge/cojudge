import java.util.*;
class Marker {
    public int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        int child = 0, cookie = 0;
        while (child < g.length && cookie < s.length) {
            if (s[cookie] >= g[child]) child++;
            cookie++;
        }
        return child;
    }
    public boolean isCorrect(int[] g, int[] s, int output) {
        return findContentChildren(g, s) == output;
    }
}
