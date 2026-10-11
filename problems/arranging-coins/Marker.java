import java.util.*;
class Marker {
    public int arrangeCoins(int n) {
        return (int)((Math.sqrt(1 + 8L * n) - 1) / 2);
    }
    public boolean isCorrect(int n, int output) {
        return arrangeCoins(n) == output;
    }
}
