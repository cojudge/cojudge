import java.util.*;
class Marker {
    public int countNumbersWithUniqueDigits(int n) {
        if (n == 0) return 1;
        if (n == 1) return 10;
        int total = 10, prod = 9;
        for (int i = 2; i <= n && i <= 10; i++) {
            prod *= (11 - i);
            total += prod;
        }
        return total;
    }
    public boolean isCorrect(int n, int output) {
        return countNumbersWithUniqueDigits(n) == output;
    }
}
