import java.util.*;
class Marker {
    private Random rng = new Random(42);
    private int rand7() { return rng.nextInt(7) + 1; }
    public int[] runRand10(int calls) {
        int[] out = new int[calls];
        for (int i = 0; i < calls; i++) {
            while (true) {
                int r = (rand7() - 1) * 7 + rand7();
                if (r <= 40) { out[i] = (r - 1) % 10 + 1; break; }
            }
        }
        return out;
    }
    public boolean isCorrect(int calls, int[] output) {
        if (output.length != calls) return false;
        for (int v : output) if (v < 1 || v > 10) return false;
        // A constant array (e.g. all 1s) passes the range check but never
        // touches a real rand7 source. Over longer runs every face 1..10 must
        // appear at least once, which only genuine rejection sampling (or an
        // equivalent uniform construction) achieves.
        if (calls >= 100) {
            boolean[] seen = new boolean[11];
            for (int v : output) seen[v] = true;
            for (int f = 1; f <= 10; f++) if (!seen[f]) return false;
        }
        return true;
    }
}
