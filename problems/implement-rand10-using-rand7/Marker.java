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
        return true;
    }
}
