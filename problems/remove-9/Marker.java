import java.util.*;
class Marker {
    public int newInteger(int n) {
        long ans = 0;
        long base = 1;
        while (n > 0) {
            ans += (n % 9) * base;
            n /= 9;
            base *= 10;
        }
        return (int) ans;
    }
    public boolean isCorrect(int n, int output) {
        return output == newInteger(n);
    }
}
