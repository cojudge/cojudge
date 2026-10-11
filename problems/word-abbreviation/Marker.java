import java.util.*;
class Marker {
    private String abbr(String w, int pref) {
        if (pref + 2 >= w.length()) return w;
        int skipped = w.length() - pref - 1;
        return w.substring(0, pref) + skipped + w.charAt(w.length() - 1);
    }
    public List<String> wordsAbbreviation(String[] words) {
        int n = words.length;
        int[] pref = new int[n];
        Arrays.fill(pref, 1);
        String[] ans = new String[n];
        for (int i = 0; i < n; i++) ans[i] = abbr(words[i], pref[i]);
        boolean changed = true;
        while (changed) {
            changed = false;
            Map<String, List<Integer>> groups = new HashMap<>();
            for (int i = 0; i < n; i++) {
                groups.computeIfAbsent(ans[i], k -> new ArrayList<>()).add(i);
            }
            for (List<Integer> g : groups.values()) {
                if (g.size() > 1) {
                    for (int i : g) {
                        pref[i]++;
                        ans[i] = abbr(words[i], pref[i]);
                    }
                    changed = true;
                }
            }
        }
        return Arrays.asList(ans);
    }
    public boolean isCorrect(String[] words, List<String> output) {
        if (output == null) return false;
        return wordsAbbreviation(words).equals(output);
    }
}
