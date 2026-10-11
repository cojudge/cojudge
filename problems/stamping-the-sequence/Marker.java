import java.util.*;
class Marker {
    public int[] movesToStamp(String stamp, String target) {
        int m = stamp.length(), n = target.length();
        if (m > n) {
            if (stamp.equals(target)) return new int[]{0};
            // stamping longer than target can never fit
            return new int[]{};
        }
        char[] t = target.toCharArray();
        boolean[] done = new boolean[n];
        List<Integer> res = new ArrayList<>();
        boolean[] vis = new boolean[n];
        int stars = 0;
        while (stars < n) {
            boolean changed = false;
            for (int i = 0; i + m <= n; i++) {
                if (vis[i]) continue;
                int match = 0;
                for (int k = 0; k < m; k++) {
                    if (t[i + k] == '?') continue;
                    if (t[i + k] != stamp.charAt(k)) { match = -1; break; }
                    match++;
                }
                if (match <= 0) continue;
                vis[i] = true;
                changed = true;
                res.add(i);
                for (int k = 0; k < m; k++) {
                    if (t[i + k] != '?') { t[i + k] = '?'; stars++; }
                }
                if (stars == n) break;
            }
            if (!changed) return new int[]{};
        }
        Collections.reverse(res);
        return res.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(String stamp, String target, int[] output) {
        int m = stamp.length(), n = target.length();
        int[] exp = movesToStamp(stamp, target);
        if (output == null) return false;
        if (exp.length == 0) return output.length == 0;
        if (output.length == 0 || output.length > 10 * n) return false;
        char[] cur = new char[n];
        Arrays.fill(cur, '?');
        for (int idx : output) {
            if (idx < 0 || idx + m > n) return false;
            for (int k = 0; k < m; k++) cur[idx + k] = stamp.charAt(k);
        }
        return new String(cur).equals(target);
    }
}
