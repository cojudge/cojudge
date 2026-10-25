import java.util.*;
class Marker {
    public int sumMultiples(int n, int k) {
        int total = 0;
        for (int i = 1; i <= n; i++) {
            if (i % k == 0) total += i;
        }
        return total;
    }
    public boolean isCorrect(int n, int k, int output) {
        return sumMultiples(n, k) == output;
    }
}
