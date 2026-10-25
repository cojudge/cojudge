import java.util.*;
class Marker {
    public int power(int base, int exp) {
        int result = 1;
        for (int i = 0; i < exp; i++) result *= base;
        return result;
    }
    public boolean isCorrect(int base, int exp, int output) {
        return power(base, exp) == output;
    }
}
