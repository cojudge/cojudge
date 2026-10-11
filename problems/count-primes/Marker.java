import java.util.*;
class Marker {
    public int countPrimes(int n) {
        if (n <= 2) return 0;
        boolean[] composite = new boolean[n];
        int count = 0;
        for (int i = 2; i < n; i++) {
            if (!composite[i]) {
                count++;
                if ((long) i * i < n) {
                    for (long j = (long) i * i; j < n; j += i) composite[(int) j] = true;
                }
            }
        }
        return count;
    }
    public boolean isCorrect(int n, int output) {
        return output == countPrimes(n);
    }
}
