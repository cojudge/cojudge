class Marker {
    public boolean isNumber(String s) {
        if (s == null) return false;
        String t = s.trim();
        if (t.isEmpty()) return false;
        int ePos = -1;
        for (int i = 0; i < t.length(); i++) {
            char c = t.charAt(i);
            if (c == 'e' || c == 'E') {
                if (ePos != -1) return false;
                ePos = i;
            }
        }
        if (ePos == -1) return isDecimal(t) || isInteger(t);
        String base = t.substring(0, ePos);
        String exp = t.substring(ePos + 1);
        if (base.isEmpty() || exp.isEmpty()) return false;
        if (!(isDecimal(base) || isInteger(base))) return false;
        return isInteger(exp);
    }
    private boolean isInteger(String s) {
        if (s.isEmpty()) return false;
        int i = 0;
        if (s.charAt(0) == '+' || s.charAt(0) == '-') {
            if (s.length() == 1) return false;
            i = 1;
        }
        for (; i < s.length(); i++) {
            if (!Character.isDigit(s.charAt(i))) return false;
        }
        return true;
    }
    private boolean isDecimal(String s) {
        if (s.isEmpty()) return false;
        int i = 0;
        if (s.charAt(0) == '+' || s.charAt(0) == '-') {
            if (s.length() == 1) return false;
            i = 1;
        }
        boolean hasDigit = false;
        boolean hasDot = false;
        for (; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '.') {
                if (hasDot) return false;
                hasDot = true;
            } else if (Character.isDigit(c)) {
                hasDigit = true;
            } else {
                return false;
            }
        }
        return hasDigit && hasDot;
    }
    public boolean isCorrect(String s, boolean output) {
        return output == isNumber(s);
    }
}
