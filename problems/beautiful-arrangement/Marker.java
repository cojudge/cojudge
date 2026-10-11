import java.util.*;
class Marker {
    private int total;
    public int countArrangement(int n) {
        total = 0;
        backtrack(n, 1, new boolean[n + 1]);
        return total;
    }
    private void backtrack(int n, int pos, boolean[] used) {
        if (pos > n) {
            total++;
            return;
        }
        for (int v = 1; v <= n; v++) {
            if (!used[v] && (v % pos == 0 || pos % v == 0)) {
                used[v] = true;
                backtrack(n, pos + 1, used);
                used[v] = false;
            }
        }
    }
    public boolean isCorrect(int n, int output) {
        return countArrangement(n) == output;
    }
}
