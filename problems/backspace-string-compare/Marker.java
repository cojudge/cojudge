class Marker {
    private String build(String s) {
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (c == '#') {
                if (sb.length() > 0) sb.setLength(sb.length() - 1);
            } else sb.append(c);
        }
        return sb.toString();
    }
    public boolean backspaceCompare(String s, String t) {
        return build(s).equals(build(t));
    }
    public boolean isCorrect(String s, String t, boolean output) {
        return backspaceCompare(s, t) == output;
    }
}
