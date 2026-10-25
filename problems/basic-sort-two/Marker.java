import java.util.*;
class Marker {
    public int[] sortTwo(int a, int b) {
        if (a <= b) return new int[]{a, b};
        return new int[]{b, a};
    }
    public boolean isCorrect(int a, int b, int[] output) {
        return Arrays.equals(sortTwo(a, b), output);
    }
}
