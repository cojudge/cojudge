import java.util.*;
class Marker {
    private String ring;
    private String key;
    private Map<Character, List<Integer>> posMap;
    private int[][] memo;
    public int findRotateSteps(String ring, String key) {
        this.ring = ring;
        this.key = key;
        posMap = new HashMap<>();
        for (int i = 0; i < ring.length(); i++) {
            char c = ring.charAt(i);
            posMap.computeIfAbsent(c, k -> new ArrayList<>()).add(i);
        }
        memo = new int[key.length() + 1][ring.length()];
        for (int[] row : memo) Arrays.fill(row, -1);
        return dp(0, 0);
    }
    private int dp(int ki, int pos) {
        if (ki == key.length()) return 0;
        if (memo[ki][pos] != -1) return memo[ki][pos];
        int best = Integer.MAX_VALUE;
        int m = ring.length();
        for (int np : posMap.get(key.charAt(ki))) {
            int diff = Math.abs(pos - np);
            int step = Math.min(diff, m - diff);
            best = Math.min(best, step + 1 + dp(ki + 1, np));
        }
        memo[ki][pos] = best;
        return best;
    }
    public boolean isCorrect(String ring, String key, int output) {
        return output == findRotateSteps(ring, key);
    }
}
