import java.util.*;
class Marker {
    public int[] diStringMatch(String s) {
        int n = s.length();
        int[] ans = new int[n + 1];
        int lo = 0;
        int hi = n;
        for (int i = 0; i < n; i++) {
            if (s.charAt(i) == 'I') {
                ans[i] = lo;
                lo++;
            } else {
                ans[i] = hi;
                hi--;
            }
        }
        ans[n] = lo;
        return ans;
    }
    public boolean isCorrect(String s, int[] output) {
        int n = s.length();
        if (output == null || output.length != n + 1) return false;
        boolean[] seen = new boolean[n + 1];
        for (int v : output) {
            if (v < 0 || v > n || seen[v]) return false;
            seen[v] = true;
        }
        for (int i = 0; i < n; i++) {
            if (s.charAt(i) == 'I' && !(output[i] < output[i + 1])) return false;
            if (s.charAt(i) == 'D' && !(output[i] > output[i + 1])) return false;
        }
        return true;
    }
}
