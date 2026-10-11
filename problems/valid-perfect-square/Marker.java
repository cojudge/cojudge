import java.util.*;
class Marker {
    public boolean isPerfectSquare(int num) {
        if (num < 1) return false;
        if (num == 1) return true;
        long lo = 1, hi = num / 2;
        while (lo <= hi) {
            long mid = (lo + hi) / 2;
            long sq = mid * mid;
            if (sq == num) return true;
            else if (sq < num) lo = mid + 1;
            else hi = mid - 1;
        }
        return false;
    }
    public boolean isCorrect(int num, boolean output) {
        return isPerfectSquare(num) == output;
    }
}
