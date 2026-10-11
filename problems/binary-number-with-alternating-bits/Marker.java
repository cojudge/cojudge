import java.util.*;
class Marker {
    public boolean hasAlternatingBits(int n) {
        int prev = n & 1;
        n >>= 1;
        while (n > 0) {
            int cur = n & 1;
            if (cur == prev) return false;
            prev = cur;
            n >>= 1;
        }
        return true;
    }
    public boolean isCorrect(int n, boolean output) {
        return hasAlternatingBits(n) == output;
    }
}
