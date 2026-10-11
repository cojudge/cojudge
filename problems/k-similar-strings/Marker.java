import java.util.*;
class Marker {
    public int kSimilarity(String s1, String s2) {
        if (s1.equals(s2)) return 0;
        Queue<String> q = new ArrayDeque<>();
        Set<String> seen = new HashSet<>();
        q.offer(s1);
        seen.add(s1);
        int steps = 0;
        while (!q.isEmpty()) {
            int sz = q.size();
            steps++;
            for (int t = 0; t < sz; t++) {
                String cur = q.poll();
                int i = 0;
                while (i < cur.length() && cur.charAt(i) == s2.charAt(i)) i++;
                for (int j = i + 1; j < cur.length(); j++) {
                    if (cur.charAt(j) == s2.charAt(i) && cur.charAt(j) != s2.charAt(j)) {
                        String nxt = swap(cur, i, j);
                        if (nxt.equals(s2)) return steps;
                        if (seen.add(nxt)) q.offer(nxt);
                    }
                }
            }
        }
        return -1;
    }
    private String swap(String s, int i, int j) {
        char[] a = s.toCharArray();
        char c = a[i]; a[i] = a[j]; a[j] = c;
        return new String(a);
    }
    public boolean isCorrect(String s1, String s2, int output) {
        return kSimilarity(s1, s2) == output;
    }
}
