import java.util.*;
class Marker {
    private static List<Long> cache = null;
    private static List<Long> allSuper() {
        if (cache != null) return cache;
        Set<Long> set = new TreeSet<>();
        for (int half = 1; half < 100000; half++) {
            String h = String.valueOf(half);
            String rev = new StringBuilder(h).reverse().toString();
            // odd-length palindrome root
            String odd = h + rev.substring(1);
            long ro = Long.parseLong(odd);
            long sqo = ro * ro;
            if (sqo < 1000000000000000000L && isPal(sqo)) set.add(sqo);
            // even-length palindrome root
            String even = h + rev;
            long re = Long.parseLong(even);
            // guard overflow: even roots beyond 1e9 square beyond limit, skip long ones
            if (even.length() <= 9) {
                long sqe = re * re;
                if (sqe < 1000000000000000000L && isPal(sqe)) set.add(sqe);
            }
        }
        cache = new ArrayList<>(set);
        return cache;
    }
    private static boolean isPal(long x) {
        String s = String.valueOf(x);
        int i = 0, j = s.length() - 1;
        while (i < j) {
            if (s.charAt(i) != s.charAt(j)) return false;
            i++; j--;
        }
        return true;
    }
    public int superpalindromesInRange(String left, String right) {
        long L = Long.parseUnsignedLong(left);
        long R;
        try { R = Long.parseUnsignedLong(right); } catch (Exception e) { R = Long.MAX_VALUE; }
        // right can be up to 10^18-1 which fits in signed long (9.99e17 < 9.22e18)
        int cnt = 0;
        for (long v : allSuper()) {
            if (v >= L && v <= R) cnt++;
        }
        return cnt;
    }
    public boolean isCorrect(String left, String right, int output) {
        return superpalindromesInRange(left, right) == output;
    }
}
