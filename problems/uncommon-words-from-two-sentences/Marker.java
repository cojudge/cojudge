import java.util.*;
class Marker {
    public List<String> uncommonFromSentences(String s1, String s2) {
        Map<String, Integer> count = new HashMap<>();
        for (String w : (s1 + " " + s2).split(" ")) {
            count.put(w, count.getOrDefault(w, 0) + 1);
        }
        List<String> res = new ArrayList<>();
        for (Map.Entry<String, Integer> e : count.entrySet()) {
            if (e.getValue() == 1) res.add(e.getKey());
        }
        return res;
    }
    public boolean isCorrect(String s1, String s2, List<String> output) {
        if (output == null) return false;
        List<String> expected = uncommonFromSentences(s1, s2);
        Collections.sort(expected);
        List<String> actual = new ArrayList<>(output);
        Collections.sort(actual);
        return expected.equals(actual);
    }
}
