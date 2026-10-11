import java.util.*;
class Marker {
    public int kthGrammar(int n, int k) {
        return Integer.bitCount(k - 1) % 2;
    }
    public boolean isCorrect(int n, int k, int output) {
        return kthGrammar(n, k) == output;
    }
}
