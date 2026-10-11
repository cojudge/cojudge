class Marker {
    private String s; private int pos;
    public int depthSum(String nestedList) {
        s = nestedList; pos = 0;
        return parseList(1);
    }
    private int parseList(int depth) {
        int total = 0;
        pos++; // '['
        while (pos < s.length() && s.charAt(pos) != ']') {
            char c = s.charAt(pos);
            if (c == ',') { pos++; continue; }
            if (c == '[') { total += parseList(depth + 1); }
            else {
                int sign = 1;
                if (c == '-') { sign = -1; pos++; }
                int num = 0;
                while (pos < s.length() && Character.isDigit(s.charAt(pos))) {
                    num = num * 10 + (s.charAt(pos) - '0');
                    pos++;
                }
                total += sign * num * depth;
            }
        }
        pos++; // ']'
        return total;
    }
    public boolean isCorrect(String nestedList, int output) {
        return depthSum(nestedList) == output;
    }
}
