import java.util.*;
class Marker {
    String s; int pos;
    public int evaluate(String expression) {
        s = expression; pos = 0;
        Deque<Map<String,Integer>> scope = new ArrayDeque<>();
        scope.push(new HashMap<>());
        return eval(scope);
    }
    private void skip() { while (pos < s.length() && s.charAt(pos) == ' ') pos++; }
    private int eval(Deque<Map<String,Integer>> scope) {
        skip();
        if (s.charAt(pos) == '(') {
            pos++;
            skip();
            String head = parseToken();
            int res;
            if (head.equals("add")) {
                int a = eval(scope); int b = eval(scope); res = a + b;
            } else if (head.equals("mult")) {
                int a = eval(scope); int b = eval(scope); res = a * b;
            } else {
                scope.push(new HashMap<>());
                res = 0;
                while (true) {
                    skip();
                    if (s.charAt(pos) == '(') { res = eval(scope); break; }
                    String tok = parseToken();
                    skip();
                    if (pos < s.length() && s.charAt(pos) == ')') {
                        res = valueOf(tok, scope);
                        break;
                    } else {
                        int v = eval(scope);
                        scope.peek().put(tok, v);
                    }
                }
                scope.pop();
            }
            skip(); pos++;
            return res;
        } else {
            String tok = parseToken();
            return valueOf(tok, scope);
        }
    }
    private String parseToken() {
        skip();
        int st = pos;
        while (pos < s.length() && s.charAt(pos) != ' ' && s.charAt(pos) != '(' && s.charAt(pos) != ')') pos++;
        return s.substring(st, pos);
    }
    private int valueOf(String tok, Deque<Map<String,Integer>> scope) {
        if (Character.isDigit(tok.charAt(0)) || tok.charAt(0) == '-') return Integer.parseInt(tok);
        for (Map<String,Integer> m : scope) if (m.containsKey(tok)) return m.get(tok);
        return 0;
    }
    public boolean isCorrect(String expression, int output) {
        return evaluate(expression) == output;
    }
}
