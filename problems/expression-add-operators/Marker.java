import java.util.*;
class Marker {
    public List<String> addOperators(String num, int target) {
        List<String> res = new ArrayList<>();
        dfs(num, target, 0, 0, 0, "", res);
        return res;
    }
    private void dfs(String num, long target, int pos, long eval, long last, String expr, List<String> res) {
        if (pos == num.length()) {
            if (eval == target) res.add(expr);
            return;
        }
        for (int i = pos; i < num.length(); i++) {
            if (i != pos && num.charAt(pos) == '0') break;
            long cur = Long.parseLong(num.substring(pos, i + 1));
            if (pos == 0) {
                dfs(num, target, i + 1, cur, cur, num.substring(pos, i + 1), res);
            } else {
                dfs(num, target, i + 1, eval + cur, cur, expr + "+" + num.substring(pos, i + 1), res);
                dfs(num, target, i + 1, eval - cur, -cur, expr + "-" + num.substring(pos, i + 1), res);
                dfs(num, target, i + 1, eval - last + last * cur, last * cur, expr + "*" + num.substring(pos, i + 1), res);
            }
        }
    }
    public boolean isCorrect(String num, int target, List<String> output) {
        List<String> exp = addOperators(num, target);
        Collections.sort(exp);
        List<String> act = output == null ? null : new ArrayList<>(output);
        if (act == null) return false;
        Collections.sort(act);
        return exp.equals(act);
    }
}
