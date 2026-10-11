import java.util.*;
class Marker {
    public List<String> removeInvalidParentheses(String s) {
        List<String> res = new ArrayList<>();
        Set<String> visited = new HashSet<>();
        Queue<String> q = new LinkedList<>();
        q.add(s);
        visited.add(s);
        boolean found = false;
        while (!q.isEmpty()) {
            int size = q.size();
            for (int k = 0; k < size; k++) {
                String cur = q.poll();
                if (valid(cur)) {
                    res.add(cur);
                    found = true;
                }
                if (found) continue;
                for (int i = 0; i < cur.length(); i++) {
                    char c = cur.charAt(i);
                    if (c != '(' && c != ')') continue;
                    if (i > 0 && cur.charAt(i) == cur.charAt(i - 1)) continue;
                    String nxt = cur.substring(0, i) + cur.substring(i + 1);
                    if (visited.add(nxt)) q.add(nxt);
                }
            }
            if (found) break;
        }
        return res;
    }
    private boolean valid(String t) {
        int bal = 0;
        for (int i = 0; i < t.length(); i++) {
            if (t.charAt(i) == '(') bal++;
            else if (t.charAt(i) == ')') {
                bal--;
                if (bal < 0) return false;
            }
        }
        return bal == 0;
    }
    public boolean isCorrect(String s, List<String> output) {
        if (output == null) return false;
        List<String> ans = removeInvalidParentheses(s);
        return new HashSet<>(ans).equals(new HashSet<>(output)) && ans.size() == output.size();
    }
}
