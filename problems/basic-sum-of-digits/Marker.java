import java.util.*;
class Marker {
    public int sumOfDigits(int n) {
        int total = 0;
        while (n > 0) {
            total += n % 10;
            n /= 10;
        }
        return total;
    }
    public boolean isCorrect(int n, int output) {
        return sumOfDigits(n) == output;
    }
}
