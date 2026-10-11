import java.util.*;
class Marker {
    private boolean isSubseq(String word, String s) {
        int j = 0;
        for (int i = 0; i < s.length() && j < word.length(); i++) {
            if (s.charAt(i) == word.charAt(j)) j++;
        }
        return j == word.length();
    }
    public String findLongestWord(String s, String[] dictionary) {
        String best = "";
        for (String w : dictionary) {
            if (!isSubseq(w, s)) continue;
            if (w.length() > best.length() ||
                (w.length() == best.length() && w.compareTo(best) < 0)) {
                best = w;
            }
        }
        return best;
    }
    public boolean isCorrect(String s, String[] dictionary, String output) {
        return findLongestWord(s, dictionary).equals(output);
    }
}
