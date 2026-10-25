import java.util.*;
class Marker {
    public int factorial(int n) {
        int result = 1;
        for (int i = 2; i <= n; i++) result *= i;
        return result;
    }
    public boolean isCorrect(int n, int output) {
        return factorial(n) == output;
    }
}
