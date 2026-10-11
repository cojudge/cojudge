import java.util.*;
class Marker {
    public int smallestFactorization(int a) {
        if (a < 10) return a;
        List<Integer> ds = new ArrayList<>();
        for (int d = 9; d >= 2; d--) {
            while (a % d == 0) { ds.add(d); a /= d; }
        }
        if (a != 1) return 0;
        Collections.sort(ds);
        long res = 0;
        for (int d : ds) res = res * 10 + d;
        if (res > Integer.MAX_VALUE) return 0;
        return (int) res;
    }
    public boolean isCorrect(int a, int output) {
        return smallestFactorization(a) == output;
    }
}
