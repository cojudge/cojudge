import java.util.*;
class Marker {
    private static final char[] COLORS = {'R','Y','B','G','W'};
    private Map<String,Integer> memo = new HashMap<>();
    public int findMinStep(String board, String hand) {
        memo.clear();
        int[] cnt = new int[5];
        for (char c : hand.toCharArray()) {
            for (int i = 0; i < 5; i++) if (COLORS[i] == c) cnt[i]++;
        }
        int ans = dfs(board, cnt);
        return ans >= 100 ? -1 : ans;
    }
    private int dfs(String board, int[] hand) {
        if (board.isEmpty()) return 0;
        String key = board + "#" + Arrays.toString(hand);
        if (memo.containsKey(key)) return memo.get(key);
        int best = 100;
        for (int ci = 0; ci < 5; ci++) {
            if (hand[ci] == 0) continue;
            char c = COLORS[ci];
            Set<String> seen = new HashSet<>();
            for (int i = 0; i <= board.length(); i++) {
                boolean adj = false;
                if (i > 0 && board.charAt(i - 1) == c) adj = true;
                if (i < board.length() && board.charAt(i) == c) adj = true;
                if (!adj) continue;
                String raw = board.substring(0, i) + c + board.substring(i);
                String nb = collapse(raw);
                if (!seen.add(nb)) continue;
                hand[ci]--;
                int sub = dfs(nb, hand);
                hand[ci]++;
                if (sub < 100) best = Math.min(best, 1 + sub);
            }
        }
        memo.put(key, best);
        return best;
    }
    private String collapse(String s) {
        String cur = s;
        boolean changed = true;
        while (changed) {
            changed = false;
            StringBuilder sb = new StringBuilder();
            int i = 0;
            while (i < cur.length()) {
                int j = i;
                while (j < cur.length() && cur.charAt(j) == cur.charAt(i)) j++;
                if (j - i >= 3) changed = true;
                else for (int k = i; k < j; k++) sb.append(cur.charAt(k));
                i = j;
            }
            cur = sb.toString();
        }
        return cur;
    }
    public boolean isCorrect(String board, String hand, int output) {
        return findMinStep(board, hand) == output;
    }
}
