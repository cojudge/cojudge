import java.util.*;
class Marker {
    public int[] getModifiedArray(int length, int[][] updates) {
        int[] ans = new int[length];
        if (length == 0) return ans;
        int[] diff = new int[length + 1];
        if (updates != null) {
            for (int[] u : updates) {
                int s = u[0], e = u[1], v = u[2];
                diff[s] += v;
                if (e + 1 < diff.length) diff[e + 1] -= v;
            }
        }
        int cur = 0;
        for (int i = 0; i < length; i++) {
            cur += diff[i];
            ans[i] = cur;
        }
        return ans;
    }
    public boolean isCorrect(int length, int[][] updates, int[] output) {
        return output != null && Arrays.equals(getModifiedArray(length, updates), output);
    }
}
