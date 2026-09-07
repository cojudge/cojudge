import java.util.*;
class Marker {
    public int openLock(String[] deadends, String target) {
        Set<String> dead = new HashSet<>(Arrays.asList(deadends));
        if (dead.contains("0000")) return -1;
        if (target.equals("0000")) return 0;
        Queue<String> q = new ArrayDeque<>();
        Set<String> seen = new HashSet<>();
        q.offer("0000"); seen.add("0000");
        int steps = 0;
        while (!q.isEmpty()) {
            int sz = q.size();
            for (int i = 0; i < sz; i++) {
                String cur = q.poll();
                for (String nxt : neighbors(cur)) {
                    if (seen.contains(nxt) || dead.contains(nxt)) continue;
                    if (nxt.equals(target)) return steps + 1;
                    seen.add(nxt); q.offer(nxt);
                }
            }
            steps++;
        }
        return -1;
    }
    private List<String> neighbors(String s) {
        List<String> res = new ArrayList<>();
        char[] a = s.toCharArray();
        for (int i = 0; i < 4; i++) {
            char c = a[i];
            a[i] = c == '9' ? '0' : (char)(c + 1);
            res.add(new String(a));
            a[i] = c == '0' ? '9' : (char)(c - 1);
            res.add(new String(a));
            a[i] = c;
        }
        return res;
    }
    public boolean isCorrect(String[] deadends, String target, int output) {
        return openLock(deadends, target) == output;
    }
}
