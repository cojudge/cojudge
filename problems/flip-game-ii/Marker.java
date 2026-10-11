import java.util.*;
class Marker {
    public boolean canWin(String currentState) {
        return dfs(currentState.toCharArray(), new HashMap<>());
    }
    private boolean dfs(char[] c, Map<String, Boolean> memo) {
        String key = new String(c);
        Boolean hit = memo.get(key);
        if (hit != null) return hit;
        for (int i = 0; i + 1 < c.length; i++) {
            if (c[i] == '+' && c[i + 1] == '+') {
                c[i] = '-';
                c[i + 1] = '-';
                boolean win = !dfs(c, memo);
                c[i] = '+';
                c[i + 1] = '+';
                if (win) {
                    memo.put(key, true);
                    return true;
                }
            }
        }
        memo.put(key, false);
        return false;
    }
    public boolean isCorrect(String currentState, boolean output) {
        return canWin(currentState) == output;
    }
}
