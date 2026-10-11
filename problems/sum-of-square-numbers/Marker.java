import java.util.*;
class Marker {
    public boolean judgeSquareSum(int c) {
        long l = 0, r = (long) Math.sqrt(c);
        while (l <= r) {
            long s = l * l + r * r;
            if (s == c) return true;
            if (s < c) l++;
            else r--;
        }
        return false;
    }
    public boolean isCorrect(int c, boolean output) {
        return judgeSquareSum(c) == output;
    }
}
