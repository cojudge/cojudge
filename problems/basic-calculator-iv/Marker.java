import java.util.*;
class Marker {
    Map<String, Integer> evalMap;
    String s;
    int pos;
    public List<String> basicCalculatorIV(String expression, String[] evalvars, int[] evalints) {
        evalMap = new HashMap<>();
        for (int i = 0; i < evalvars.length; i++) evalMap.put(evalvars[i], evalints[i]);
        s = expression;
        pos = 0;
        Map<List<String>, Integer> poly = parseExpr();
        List<Map.Entry<List<String>, Integer>> terms = new ArrayList<>();
        for (Map.Entry<List<String>, Integer> e : poly.entrySet()) {
            if (e.getValue() != 0) terms.add(e);
        }
        terms.sort((a, b) -> {
            if (a.getKey().size() != b.getKey().size()) return b.getKey().size() - a.getKey().size();
            String sa = String.join("*", a.getKey());
            String sb = String.join("*", b.getKey());
            return sa.compareTo(sb);
        });
        List<String> ans = new ArrayList<>();
        for (Map.Entry<List<String>, Integer> e : terms) {
            if (e.getKey().isEmpty()) ans.add(String.valueOf(e.getValue()));
            else ans.add(e.getValue() + "*" + String.join("*", e.getKey()));
        }
        return ans;
    }
    private void skipSpaces() {
        while (pos < s.length() && s.charAt(pos) == ' ') pos++;
    }
    private Map<List<String>, Integer> parseExpr() {
        Map<List<String>, Integer> res = parseTerm();
        while (true) {
            skipSpaces();
            if (pos < s.length() && (s.charAt(pos) == '+' || s.charAt(pos) == '-')) {
                char op = s.charAt(pos++);
                Map<List<String>, Integer> t = parseTerm();
                if (op == '+') res = add(res, t);
                else res = add(res, negate(t));
            } else break;
        }
        return res;
    }
    private Map<List<String>, Integer> parseTerm() {
        Map<List<String>, Integer> res = parseFactor();
        while (true) {
            skipSpaces();
            if (pos < s.length() && s.charAt(pos) == '*') {
                pos++;
                Map<List<String>, Integer> f = parseFactor();
                res = mul(res, f);
            } else break;
        }
        return res;
    }
    private Map<List<String>, Integer> parseFactor() {
        skipSpaces();
        if (pos < s.length() && s.charAt(pos) == '(') {
            pos++;
            Map<List<String>, Integer> e = parseExpr();
            skipSpaces();
            if (pos < s.length() && s.charAt(pos) == ')') pos++;
            return e;
        }
        if (pos < s.length() && (s.charAt(pos) == '+' || s.charAt(pos) == '-')) {
            char op = s.charAt(pos++);
            Map<List<String>, Integer> f = parseFactor();
            if (op == '-') return negate(f);
            return f;
        }
        if (pos < s.length() && Character.isDigit(s.charAt(pos))) {
            int num = 0;
            while (pos < s.length() && Character.isDigit(s.charAt(pos))) {
                num = num * 10 + (s.charAt(pos++) - '0');
            }
            Map<List<String>, Integer> m = new HashMap<>();
            m.put(new ArrayList<>(), num);
            return m;
        }
        if (pos < s.length() && Character.isLowerCase(s.charAt(pos))) {
            StringBuilder sb = new StringBuilder();
            while (pos < s.length() && Character.isLowerCase(s.charAt(pos))) sb.append(s.charAt(pos++));
            String name = sb.toString();
            Map<List<String>, Integer> m = new HashMap<>();
            if (evalMap.containsKey(name)) {
                m.put(new ArrayList<>(), evalMap.get(name));
            } else {
                List<String> key = new ArrayList<>();
                key.add(name);
                m.put(key, 1);
            }
            return m;
        }
        return new HashMap<>();
    }
    private Map<List<String>, Integer> add(Map<List<String>, Integer> a, Map<List<String>, Integer> b) {
        Map<List<String>, Integer> r = new HashMap<>(a);
        for (Map.Entry<List<String>, Integer> e : b.entrySet()) {
            r.put(e.getKey(), r.getOrDefault(e.getKey(), 0) + e.getValue());
        }
        return r;
    }
    private Map<List<String>, Integer> negate(Map<List<String>, Integer> a) {
        Map<List<String>, Integer> r = new HashMap<>();
        for (Map.Entry<List<String>, Integer> e : a.entrySet()) r.put(e.getKey(), -e.getValue());
        return r;
    }
    private Map<List<String>, Integer> mul(Map<List<String>, Integer> a, Map<List<String>, Integer> b) {
        Map<List<String>, Integer> r = new HashMap<>();
        for (Map.Entry<List<String>, Integer> e1 : a.entrySet()) {
            for (Map.Entry<List<String>, Integer> e2 : b.entrySet()) {
                List<String> key = new ArrayList<>(e1.getKey());
                key.addAll(e2.getKey());
                Collections.sort(key);
                int c = e1.getValue() * e2.getValue();
                r.put(key, r.getOrDefault(key, 0) + c);
            }
        }
        return r;
    }
    public boolean isCorrect(String expression, String[] evalvars, int[] evalints, List<String> output) {
        List<String> exp = basicCalculatorIV(expression, evalvars, evalints);
        return exp.equals(output);
    }
}
