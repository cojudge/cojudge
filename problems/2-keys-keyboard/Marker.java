import java.util.*;
class Marker {
    public int minSteps(int n) {
        if (n <= 1) return 0;
        int ans = 0, x = n;
        for (int d = 2; d * d <= x; d++) {
            while (x % d == 0) {
                ans += d;
                x /= d;
            }
        }
        if (x > 1) ans += x;
        return ans;
    }
    public boolean isCorrect(int n, int output) {
        return minSteps(n) == output;
    }
}
