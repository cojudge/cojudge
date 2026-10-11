class Marker {
    String s;
    int pos;
    public int calculate(String s) {
        this.s = s;
        this.pos = 0;
        return parseExpr();
    }
    private void skip() {
        while (pos < s.length() && s.charAt(pos) == ' ') pos++;
    }
    private int parseExpr() {
        int v = parseTerm();
        while (true) {
            skip();
            if (pos < s.length() && (s.charAt(pos) == '+' || s.charAt(pos) == '-')) {
                char op = s.charAt(pos++);
                int t = parseTerm();
                v = op == '+' ? v + t : v - t;
            } else break;
        }
        return v;
    }
    private int parseTerm() {
        int v = parseFactor();
        while (true) {
            skip();
            if (pos < s.length() && (s.charAt(pos) == '*' || s.charAt(pos) == '/')) {
                char op = s.charAt(pos++);
                int f = parseFactor();
                v = op == '*' ? v * f : v / f;
            } else break;
        }
        return v;
    }
    private int parseFactor() {
        skip();
        if (pos < s.length() && (s.charAt(pos) == '+' || s.charAt(pos) == '-')) {
            char op = s.charAt(pos++);
            int f = parseFactor();
            return op == '-' ? -f : f;
        }
        if (pos < s.length() && s.charAt(pos) == '(') {
            pos++;
            int v = parseExpr();
            skip();
            if (pos < s.length() && s.charAt(pos) == ')') pos++;
            return v;
        }
        int num = 0;
        boolean has = false;
        while (pos < s.length() && Character.isDigit(s.charAt(pos))) {
            num = num * 10 + (s.charAt(pos++) - '0');
            has = true;
        }
        return has ? num : 0;
    }
    public boolean isCorrect(String s, int output) {
        return output == calculate(s);
    }
}
