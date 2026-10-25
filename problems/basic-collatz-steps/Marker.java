import java.util.*;
class Marker {
    public int collatzSteps(int n) {
        if (n == 1) return 0;
        if (n % 2 == 0) return 1 + collatzSteps(n / 2);
        return 1 + collatzSteps(3 * n + 1);
    }
    public boolean isCorrect(int n, int output) {
        return collatzSteps(n) == output;
    }
}
