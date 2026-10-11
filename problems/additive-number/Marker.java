class Marker {
    public boolean isAdditiveNumber(String num) {
        int n = num.length();
        for (int i = 1; i < n; i++) {
            if (i > 1 && num.charAt(0) == '0') break;
            for (int j = 1; i + j < n; j++) {
                if (j > 1 && num.charAt(i) == '0') break;
                if (check(num, 0, i, i, i + j)) return true;
            }
        }
        return false;
    }
    private boolean check(String num, int a, int b, int c, int d) {
        String x = num.substring(a, b), y = num.substring(c, d);
        int k = d;
        while (k < num.length()) {
            String z = addStr(x, y);
            if (!num.startsWith(z, k)) return false;
            k += z.length();
            x = y;
            y = z;
        }
        return true;
    }
    private String addStr(String x, String y) {
        StringBuilder sb = new StringBuilder();
        int i = x.length() - 1, j = y.length() - 1, carry = 0;
        while (i >= 0 || j >= 0 || carry > 0) {
            int s = carry;
            if (i >= 0) s += x.charAt(i--) - '0';
            if (j >= 0) s += y.charAt(j--) - '0';
            sb.append((char) ('0' + s % 10));
            carry = s / 10;
        }
        return sb.reverse().toString();
    }
    public boolean isCorrect(String num, boolean output) {
        return isAdditiveNumber(num) == output;
    }
}
