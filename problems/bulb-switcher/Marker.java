import java.util.*;
class Marker {
    public int bulbSwitch(int n) {
        return (int) Math.sqrt(n);
    }
    public boolean isCorrect(int n, int output) {
        return bulbSwitch(n) == output;
    }
}
