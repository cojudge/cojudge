import java.util.*;
class Marker {
    private String abbr(String w) {
        if (w.length() <= 2) return w;
        return "" + w.charAt(0) + (w.length() - 2) + w.charAt(w.length() - 1);
    }
    public int[] checkAbbr(String[] dictionary, String[] words) {
        Map<String, Set<String>> m = new HashMap<>();
        for (String w : dictionary) {
            String a = abbr(w);
            m.computeIfAbsent(a, k -> new HashSet<>()).add(w);
        }
        int[] ans = new int[words.length];
        for (int i = 0; i < words.length; i++) {
            String a = abbr(words[i]);
            if (!m.containsKey(a)) ans[i] = 1;
            else {
                Set<String> s = m.get(a);
                ans[i] = (s.size() == 1 && s.contains(words[i])) ? 1 : 0;
            }
        }
        return ans;
    }
    public boolean isCorrect(String[] dictionary, String[] words, int[] output) {
        return Arrays.equals(checkAbbr(dictionary, words), output);
    }
}
