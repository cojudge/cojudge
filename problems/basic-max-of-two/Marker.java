import java.util.*;
class Marker {
    public int maxOfTwo(int a, int b) {
        if (a >= b) return a;
        return b;
    }
    public boolean isCorrect(int a, int b, int output) {
        return maxOfTwo(a, b) == output;
    }
}
