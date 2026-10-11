import java.util.*;
class Marker {
    public int reachNumber(int target) {
        long t = Math.abs((long) target);
        long n = 0;
        while (true) {
            n++;
            long sum = n * (n + 1) / 2;
            if (sum >= t && ((sum - t) % 2 == 0)) return (int) n;
        }
    }
    public boolean isCorrect(int target, int output) {
        return reachNumber(target) == output;
    }
}
