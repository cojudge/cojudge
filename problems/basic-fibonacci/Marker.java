import java.util.*;
class Marker {
    public int fibonacci(int n) {
        if (n == 0) return 0;
        if (n == 1) return 1;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    public boolean isCorrect(int n, int output) {
        return fibonacci(n) == output;
    }
}
