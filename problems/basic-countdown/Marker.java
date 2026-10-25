import java.util.*;
class Marker {
    public int[] countdown(int n) {
        int[] ans = new int[n];
        for (int i = 0; i < n; i++) ans[i] = n - i;
        return ans;
    }
    public boolean isCorrect(int n, int[] output) {
        return Arrays.equals(countdown(n), output);
    }
}
