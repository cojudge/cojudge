import java.util.*;
class Marker {
    public String longestWord(String[] words) {
        Set<String> set = new HashSet<>(Arrays.asList(words));
        Arrays.sort(words, (a, b) -> {
            if (a.length() != b.length()) return b.length() - a.length();
            return a.compareTo(b);
        });
        for (String w : words) {
            boolean ok = true;
            for (int i = 1; i < w.length(); i++) {
                if (!set.contains(w.substring(0, i))) { ok = false; break; }
            }
            if (ok && w.length() >= 1) {
                if (w.length() == 1) return w;
                boolean all = true;
                for (int i = 1; i <= w.length(); i++) {
                    if (!set.contains(w.substring(0, i))) { all = false; break; }
                }
                if (all) return w;
            }
        }
        return "";
    }
    public boolean isCorrect(String[] words, String output) {
        return longestWord(words.clone()).equals(output);
    }
}
