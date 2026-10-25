import java.util.*;
class Marker {
    public boolean isEven(int n) {
        return n % 2 == 0;
    }
    public boolean isCorrect(int n, boolean output) {
        return isEven(n) == output;
    }
}
