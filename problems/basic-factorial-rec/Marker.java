import java.util.*;
class Marker {
    public int factorialRec(int n) {
        if (n <= 1) return 1;
        return n * factorialRec(n - 1);
    }
    public boolean isCorrect(int n, int output) {
        return factorialRec(n) == output;
    }
}
