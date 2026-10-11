import java.util.*;
class Marker {
    public boolean wordPattern(String pattern, String s) {
        String[] words = s.split(" ", -1);
        if (words.length != pattern.length()) return false;
        Map<Character, String> c2w = new HashMap<>();
        Map<String, Character> w2c = new HashMap<>();
        for (int i = 0; i < pattern.length(); i++) {
            char c = pattern.charAt(i);
            String w = words[i];
            if (c2w.containsKey(c)) { if (!c2w.get(c).equals(w)) return false; }
            else c2w.put(c, w);
            if (w2c.containsKey(w)) { if (w2c.get(w) != c) return false; }
            else w2c.put(w, c);
        }
        return true;
    }
    public boolean isCorrect(String pattern, String s, boolean output) {
        return output == wordPattern(pattern, s);
    }
}
