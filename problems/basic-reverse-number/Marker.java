import java.util.*;
class Marker {
    public int reverseNumber(int n) {
        int rev = 0;
        while (n > 0) {
            rev = rev * 10 + n % 10;
            n /= 10;
        }
        return rev;
    }
    public boolean isCorrect(int n, int output) {
        return reverseNumber(n) == output;
    }
}
