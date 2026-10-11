import java.util.*;
class Marker {
    public boolean canIWin(int maxChoosableInteger, int desiredTotal) {
        if (desiredTotal <= 0) return true;
        int sum = maxChoosableInteger * (maxChoosableInteger + 1) / 2;
        if (sum < desiredTotal) return false;
        return dfs(0, 0, maxChoosableInteger, desiredTotal, new HashMap<>());
    }
    private boolean dfs(int used, int total, int max, int want, Map<Integer, Boolean> memo) {
        if (memo.containsKey(used)) return memo.get(used);
        for (int i = 1; i <= max; i++) {
            int bit = 1 << (i - 1);
            if ((used & bit) != 0) continue;
            if (total + i >= want || !dfs(used | bit, total + i, max, want, memo)) {
                memo.put(used, true);
                return true;
            }
        }
        memo.put(used, false);
        return false;
    }
    public boolean isCorrect(int maxChoosableInteger, int desiredTotal, boolean output) {
        return canIWin(maxChoosableInteger, desiredTotal) == output;
    }
}
