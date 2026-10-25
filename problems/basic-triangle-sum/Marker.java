import java.util.*;
class Marker {
    public int triangleSum(int n) {
        int total = 0;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) total += j;
        }
        return total;
    }
    public boolean isCorrect(int n, int output) {
        return triangleSum(n) == output;
    }
}
