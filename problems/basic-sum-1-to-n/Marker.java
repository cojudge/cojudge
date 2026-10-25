import java.util.*;
class Marker {
    public int sumUpTo(int n) {
        int total = 0;
        for (int i = 1; i <= n; i++) total += i;
        return total;
    }
    public boolean isCorrect(int n, int output) {
        return sumUpTo(n) == output;
    }
}
