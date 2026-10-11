import java.util.*;
class Marker {
    public int integerReplacement(int n) {
        long x = n;
        int steps = 0;
        while (x != 1) {
            if ((x & 1) == 0) {
                x >>= 1;
            } else if (x == 3 || (x & 3) == 1) {
                x--;
            } else {
                x++;
            }
            steps++;
        }
        return steps;
    }
    public boolean isCorrect(int n, int output) {
        return output == integerReplacement(n);
    }
}
