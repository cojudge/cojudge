import java.util.*;
class Marker {
    public boolean areSentencesSimilar(String[] sentence1, String[] sentence2, List<List<String>> similarPairs) {
        if (sentence1.length != sentence2.length) return false;
        Set<String> s = new HashSet<>();
        for (List<String> p : similarPairs) {
            s.add(p.get(0) + "\u0000" + p.get(1));
            s.add(p.get(1) + "\u0000" + p.get(0));
        }
        for (int i = 0; i < sentence1.length; i++) {
            if (sentence1[i].equals(sentence2[i])) continue;
            if (!s.contains(sentence1[i] + "\u0000" + sentence2[i])) return false;
        }
        return true;
    }
    public boolean isCorrect(String[] sentence1, String[] sentence2, List<List<String>> similarPairs, boolean output) {
        return areSentencesSimilar(sentence1, sentence2, similarPairs) == output;
    }
}
