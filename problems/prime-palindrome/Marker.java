class Marker {
    public int primePalindrome(int n) {
        if (n <= 2) return 2;
        if (n == 3) return 3;
        if (n <= 5) return 5;
        if (n <= 7) return 7;
        if (n <= 11) return 11;
        for (int len = String.valueOf(n).length(); len <= 9; len++) {
            if (len % 2 == 0) {
                if (len == 2) continue;
                // even lengths > 2 have no prime palindrome except 11 already handled
                continue;
            }
            int start = (int) Math.pow(10, (len - 1) / 2);
            int end = (int) Math.pow(10, (len + 1) / 2);
            for (int half = start; half < end; half++) {
                int pal = makePal(half, len);
                if (pal < n) continue;
                if (isPrime(pal)) return pal;
            }
        }
        return -1;
    }
    private int makePal(int half, int len) {
        String s = Integer.toString(half);
        StringBuilder sb = new StringBuilder(s);
        int skip = len % 2 == 1 ? 1 : 0;
        for (int i = s.length() - 1 - skip; i >= 0; i--) sb.append(s.charAt(i));
        long v = Long.parseLong(sb.toString());
        return v > Integer.MAX_VALUE ? Integer.MAX_VALUE : (int) v;
    }
    private boolean isPrime(int x) {
        if (x < 2) return false;
        if (x % 2 == 0) return x == 2;
        for (int d = 3; (long) d * d <= x; d += 2) if (x % d == 0) return false;
        return true;
    }
    public boolean isCorrect(int n, int output) {
        return primePalindrome(n) == output;
    }
}
