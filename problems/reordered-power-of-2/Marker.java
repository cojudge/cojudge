import java.util.*;
class Marker {
    public boolean reorderedPowerOf2(int n) {
        String sig = sig(n);
        for (int p = 1; p <= 1000000000; p <<= 1) {
            if (sig(p).equals(sig)) return true;
            if (p > 536870912) break;
        }
        return false;
    }
    private String sig(int x) {
        char[] c = String.valueOf(x).toCharArray();
        Arrays.sort(c);
        return new String(c);
    }
    public boolean isCorrect(int n, boolean output) {
        return reorderedPowerOf2(n) == output;
    }
}
