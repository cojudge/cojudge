import java.util.*;
class Marker {
    public List<String> findWords(String[] words) {
        Set<Character> r1 = new HashSet<>();
        for (char c : "qwertyuiop".toCharArray()) r1.add(c);
        Set<Character> r2 = new HashSet<>();
        for (char c : "asdfghjkl".toCharArray()) r2.add(c);
        Set<Character> r3 = new HashSet<>();
        for (char c : "zxcvbnm".toCharArray()) r3.add(c);
        List<String> ans = new ArrayList<>();
        for (String w : words) {
            if (w == null || w.isEmpty()) continue;
            String low = w.toLowerCase();
            Set<Character> ref;
            char f = low.charAt(0);
            if (r1.contains(f)) ref = r1;
            else if (r2.contains(f)) ref = r2;
            else ref = r3;
            boolean ok = true;
            for (char c : low.toCharArray()) if (!ref.contains(c)) { ok = false; break; }
            if (ok) ans.add(w);
        }
        return ans;
    }
    public boolean isCorrect(String[] words, List<String> output) {
        if (output == null) return false;
        return findWords(words).equals(output);
    }
}
