import java.util.*;
class Marker {
    public String minAbbreviation(String target, String[] dictionary) {
        int n = target.length();
        List<String> dict = new ArrayList<>();
        for (String w : dictionary) if (w.length() == n) dict.add(w);
        if (dict.isEmpty()) return String.valueOf(n);
        String best = target;
        int total = 1 << n;
        for (int mask = 0; mask < total; mask++) {
            String abbr = toAbbr(target, mask);
            if (abbr.length() >= best.length()) continue;
            boolean conflict = false;
            for (String w : dict) {
                if (matches(abbr, w)) { conflict = true; break; }
            }
            if (!conflict) {
                if (abbr.length() < best.length() || (abbr.length() == best.length() && abbr.compareTo(best) < 0)) best = abbr;
            }
        }
        return best;
    }
    private String toAbbr(String t, int mask) {
        StringBuilder sb = new StringBuilder();
        int cnt = 0;
        for (int i = 0; i < t.length(); i++) {
            if (((mask >> i) & 1) == 1) cnt++;
            else {
                if (cnt > 0) { sb.append(cnt); cnt = 0; }
                sb.append(t.charAt(i));
            }
        }
        if (cnt > 0) sb.append(cnt);
        return sb.toString();
    }
    private boolean matches(String abbr, String word) {
        int i = 0, j = 0;
        int n = word.length(), m = abbr.length();
        while (j < m) {
            char c = abbr.charAt(j);
            if (Character.isDigit(c)) {
                if (c == '0') return false;
                int num = 0;
                while (j < m && Character.isDigit(abbr.charAt(j))) {
                    num = num * 10 + (abbr.charAt(j) - '0');
                    j++;
                }
                i += num;
                if (i > n) return false;
            } else {
                if (i >= n || word.charAt(i) != c) return false;
                i++; j++;
            }
        }
        return i == n && j == m;
    }
    private int minLength(String target, String[] dictionary) {
        return minAbbreviation(target, dictionary).length();
    }
    public boolean isCorrect(String target, String[] dictionary, String output) {
        if (output == null || output.isEmpty()) return false;
        if (!matches(output, target)) return false;
        int n = target.length();
        for (String w : dictionary) {
            if (w.length() != n) continue;
            if (matches(output, w)) return false;
        }
        return output.length() == minLength(target, dictionary);
    }
}
