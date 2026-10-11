import java.util.*;
class Marker {
    public List<String> findRepeatedDnaSequences(String s) {
        Map<String, Integer> count = new HashMap<>();
        List<String> res = new ArrayList<>();
        for (int i = 0; i + 10 <= s.length(); i++) {
            String sub = s.substring(i, i + 10);
            int c = count.getOrDefault(sub, 0) + 1;
            count.put(sub, c);
            if (c == 2) res.add(sub);
        }
        return res;
    }
    public boolean isCorrect(String s, List<String> output) {
        if (output == null) return false;
        for (String w : output) if (w == null) return false;
        List<String> expected = new ArrayList<>(findRepeatedDnaSequences(s));
        List<String> actual = new ArrayList<>(output);
        Collections.sort(expected);
        Collections.sort(actual);
        return expected.equals(actual);
    }
}
