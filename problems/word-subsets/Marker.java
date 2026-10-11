import java.util.*;
class Marker {
    public List<String> wordSubsets(String[] words1, String[] words2) {
        int[] need = new int[26];
        for (String w : words2) {
            int[] c = new int[26];
            for (char ch : w.toCharArray()) c[ch - 'a']++;
            for (int i = 0; i < 26; i++) need[i] = Math.max(need[i], c[i]);
        }
        List<String> ans = new ArrayList<>();
        for (String w : words1) {
            int[] c = new int[26];
            for (char ch : w.toCharArray()) c[ch - 'a']++;
            boolean ok = true;
            for (int i = 0; i < 26; i++) if (c[i] < need[i]) { ok = false; break; }
            if (ok) ans.add(w);
        }
        return ans;
    }
    public boolean isCorrect(String[] words1, String[] words2, List<String> output) {
        if (output == null) return false;
        List<String> exp = new ArrayList<>(wordSubsets(words1, words2));
        List<String> act = new ArrayList<>(output);
        Collections.sort(exp);
        Collections.sort(act);
        return exp.equals(act);
    }
}
