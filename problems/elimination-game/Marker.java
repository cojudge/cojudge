import java.util.*;
class Marker {
    public int lastRemaining(int n) {
        long head = 1;
        long step = 1;
        long remaining = n;
        boolean left = true;
        while (remaining > 1) {
            if (left || (remaining % 2 == 1)) head += step;
            remaining /= 2;
            step *= 2;
            left = !left;
        }
        return (int) head;
    }
    public boolean isCorrect(int n, int output) {
        return output == lastRemaining(n);
    }
}
