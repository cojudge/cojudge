import java.util.*;
class Marker {
    public boolean wordPatternMatch(String pattern, String s) {
        return dfs(pattern, 0, s, 0, new HashMap<>(), new HashSet<>());
    }
    private boolean dfs(String p, int i, String s, int j, Map<Character, String> m, Set<String> used) {
        if (i == p.length()) return j == s.length();
        char c = p.charAt(i);
        if (m.containsKey(c)) {
            String w = m.get(c);
            if (!s.startsWith(w, j)) return false;
            return dfs(p, i + 1, s, j + w.length(), m, used);
        }
        for (int k = j + 1; k <= s.length(); k++) {
            String w = s.substring(j, k);
            if (used.contains(w)) continue;
            m.put(c, w);
            used.add(w);
            if (dfs(p, i + 1, s, k, m, used)) return true;
            m.remove(c);
            used.remove(w);
        }
        return false;
    }
    public boolean isCorrect(String pattern, String s, boolean output) {
        return wordPatternMatch(pattern, s) == output;
    }
}
