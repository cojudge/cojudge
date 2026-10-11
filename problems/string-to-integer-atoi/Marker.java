class Marker {
    public int myAtoi(String s) {
        int i = 0, n = s.length();
        while (i < n && s.charAt(i) == ' ') i++;
        int sign = 1;
        if (i < n && (s.charAt(i) == '+' || s.charAt(i) == '-')) {
            if (s.charAt(i) == '-') sign = -1;
            i++;
        }
        long val = 0;
        while (i < n && s.charAt(i) >= '0' && s.charAt(i) <= '9') {
            val = val * 10 + (s.charAt(i) - '0');
            if (sign == 1 && val > Integer.MAX_VALUE) return Integer.MAX_VALUE;
            if (sign == -1 && -val < Integer.MIN_VALUE) return Integer.MIN_VALUE;
            i++;
        }
        return (int) (sign * val);
    }
    public boolean isCorrect(String s, int output) {
        return myAtoi(s) == output;
    }
}
