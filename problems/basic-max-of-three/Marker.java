import java.util.*;
class Marker {
    public int maxOfThree(int a, int b, int c) {
        int best = a;
        if (b > best) best = b;
        if (c > best) best = c;
        return best;
    }
    public boolean isCorrect(int a, int b, int c, int output) {
        return maxOfThree(a, b, c) == output;
    }
}
