import java.util.*;
class Marker {
    public int gcd(int a, int b) {
        if (b == 0) return a;
        return gcd(b, a % b);
    }
    public boolean isCorrect(int a, int b, int output) {
        return gcd(a, b) == output;
    }
}
