import java.util.*;
class Marker {
    private String mirror(String s, int len) {
        StringBuilder sb = new StringBuilder(s);
        int take = Math.min(len / 2, s.length());
        for (int i = take - 1; i >= 0; i--) sb.append(s.charAt(i));
        return sb.toString();
    }
    public String nearestPalindromic(String n) {
        int len = n.length();
        long self = Long.parseLong(n);
        Set<Long> cand = new HashSet<>();
        long p10 = 1;
        for (int i = 0; i < len; i++) p10 *= 10;
        cand.add(p10 + 1);
        if (len > 1) {
            long p9 = 1;
            for (int i = 0; i < len - 1; i++) p9 *= 10;
            cand.add(p9 - 1);
        } else {
            cand.add(0L);
        }
        int half = (len + 1) / 2;
        long prefix = Long.parseLong(n.substring(0, half));
        for (long p = prefix - 1; p <= prefix + 1; p++) {
            if (p < 0) continue;
            String ps = String.valueOf(p);
            try {
                cand.add(Long.parseLong(mirror(ps, len)));
            } catch (NumberFormatException e) {
                // mirrored value overflows long; it can never be the closest
            }
        }
        cand.remove(self);
        long best = 0;
        boolean first = true;
        for (long c : cand) {
            if (first || Math.abs(c - self) < Math.abs(best - self)
                || (Math.abs(c - self) == Math.abs(best - self) && c < best)) {
                best = c;
                first = false;
            }
        }
        return String.valueOf(best);
    }
    public boolean isCorrect(String n, String output) {
        return nearestPalindromic(n).equals(output);
    }
}
