import java.util.*;
class Marker {
    public int sumDigitsRec(int n) {
        if (n < 10) return n;
        return n % 10 + sumDigitsRec(n / 10);
    }
    public boolean isCorrect(int n, int output) {
        return sumDigitsRec(n) == output;
    }
}
