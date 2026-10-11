import java.util.*;
class Marker {
    private String shape(String w) {
        Map<Character, Integer> seen = new HashMap<>();
        StringBuilder sb = new StringBuilder();
        int id = 0;
        for (char c : w.toCharArray()) {
            if (!seen.containsKey(c)) seen.put(c, id++);
            sb.append(seen.get(c)).append(',');
        }
        return sb.toString();
    }
    public List<String> findAndReplacePattern(String[] words, String pattern) {
        String target = shape(pattern);
        List<String> res = new ArrayList<>();
        for (String w : words) {
            if (shape(w).equals(target)) res.add(w);
        }
        return res;
    }
    public boolean isCorrect(String[] words, String pattern, List<String> output) {
        if (output == null) return false;
        List<String> expected = findAndReplacePattern(words, pattern);
        Collections.sort(expected);
        List<String> actual = new ArrayList<>(output);
        Collections.sort(actual);
        return expected.equals(actual);
    }
}
