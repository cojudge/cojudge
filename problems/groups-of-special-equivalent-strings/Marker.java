import java.util.*;
class Marker {
    public int numSpecialEquivGroups(String[] words) {
        Set<String> seen = new HashSet<>();
        for (String w : words) {
            StringBuilder even = new StringBuilder();
            StringBuilder odd = new StringBuilder();
            for (int i = 0; i < w.length(); i++) {
                if (i % 2 == 0) even.append(w.charAt(i));
                else odd.append(w.charAt(i));
            }
            char[] e = even.toString().toCharArray();
            char[] o = odd.toString().toCharArray();
            Arrays.sort(e);
            Arrays.sort(o);
            seen.add(new String(e) + "|" + new String(o));
        }
        return seen.size();
    }
    public boolean isCorrect(String[] words, int output) {
        return numSpecialEquivGroups(words) == output;
    }
}
