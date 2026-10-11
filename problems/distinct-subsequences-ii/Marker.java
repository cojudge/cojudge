import java.util.*;
class Marker {
    public int distinctSubseqII(String s) {
        final long MOD = 1000000007L;
        long total = 1;
        Map<Character, Long> last = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            long prev = total;
            long had = last.getOrDefault(c, 0L);
            total = (total * 2 - had + MOD) % MOD;
            last.put(c, prev);
        }
        return (int) ((total - 1 + MOD) % MOD);
    }
    public boolean isCorrect(String s, int output) {
        return distinctSubseqII(s) == output;
    }
}
