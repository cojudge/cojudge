import java.util.*;
class Marker {
    public boolean canMeasureWater(int x, int y, int target) {
        if (target < 0) return false;
        if (target == 0) return true;
        if (x + y < target) return false;
        if (x == 0) return y == target;
        if (y == 0) return x == target;
        return target % gcd(x, y) == 0;
    }
    private int gcd(int a, int b) {
        while (b != 0) { int t = a % b; a = b; b = t; }
        return a;
    }
    public boolean isCorrect(int x, int y, int target, boolean output) {
        return canMeasureWater(x, y, target) == output;
    }
}
