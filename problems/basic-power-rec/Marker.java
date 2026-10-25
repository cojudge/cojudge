import java.util.*;
class Marker {
    public int powerRec(int base, int exp) {
        if (exp == 0) return 1;
        return base * powerRec(base, exp - 1);
    }
    public boolean isCorrect(int base, int exp, int output) {
        return powerRec(base, exp) == output;
    }
}
