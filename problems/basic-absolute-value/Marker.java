import java.util.*;
class Marker {
    public int absVal(int n) {
        if (n < 0) return -n;
        return n;
    }
    public boolean isCorrect(int n, int output) {
        return absVal(n) == output;
    }
}
