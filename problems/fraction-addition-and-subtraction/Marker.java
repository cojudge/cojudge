class Marker {
    private long gcd(long a, long b) { while (b != 0) { long t = a % b; a = b; b = t; } return a; }
    public String fractionAddition(String expression) {
        long rn = 0, rd = 1;
        int i = 0, n = expression.length();
        while (i < n) {
            int sign = 1;
            char c = expression.charAt(i);
            if (c == '+' || c == '-') { sign = (c == '-') ? -1 : 1; i++; }
            int j = i;
            while (j < n && Character.isDigit(expression.charAt(j))) j++;
            long a = Long.parseLong(expression.substring(i, j));
            i = j + 1;
            j = i;
            while (j < n && Character.isDigit(expression.charAt(j))) j++;
            long b = Long.parseLong(expression.substring(i, j));
            i = j;
            a *= sign;
            rn = rn * b + a * rd;
            rd = rd * b;
            long g = gcd(Math.abs(rn), rd);
            rn /= g; rd /= g;
        }
        return rn + "/" + rd;
    }
    public boolean isCorrect(String expression, String output) {
        if (output == null) return false;
        return fractionAddition(expression).equals(output);
    }
}
