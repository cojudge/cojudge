import java.util.*;
class Marker {
    public boolean hasGroupsSizeX(int[] deck) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int v : deck) count.put(v, count.getOrDefault(v, 0) + 1);
        int g = 0;
        for (int c : count.values()) g = gcd(g, c);
        return g >= 2;
    }
    private int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
    public boolean isCorrect(int[] deck, boolean output) {
        return hasGroupsSizeX(deck) == output;
    }
}
