import java.util.*;
class Marker {
    public int rotatedDigits(int n) {
        int count = 0;
        for (int x = 1; x <= n; x++) {
            if (isGood(x)) count++;
        }
        return count;
    }
    private boolean isGood(int x) {
        boolean changed = false;
        while (x > 0) {
            int d = x % 10;
            if (d == 3 || d == 4 || d == 7) return false;
            if (d == 2 || d == 5 || d == 6 || d == 9) changed = true;
            x /= 10;
        }
        return changed;
    }
    public boolean isCorrect(int n, int output) {
        return rotatedDigits(n) == output;
    }
}
