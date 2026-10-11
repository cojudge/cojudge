import java.util.*;
class Marker {
    Map<String,String> par;
    String find(String x) {
        par.putIfAbsent(x, x);
        if (!par.get(x).equals(x)) par.put(x, find(par.get(x)));
        return par.get(x);
    }
    void union(String a, String b) { par.put(find(a), find(b)); }
    public boolean areSentencesSimilarTwo(String[] s1, String[] s2, List<List<String>> pairs) {
        if (s1.length != s2.length) return false;
        par = new HashMap<>();
        for (List<String> p : pairs) union(p.get(0), p.get(1));
        for (int i = 0; i < s1.length; i++) {
            if (s1[i].equals(s2[i])) continue;
            String a = par.getOrDefault(s1[i], s1[i]);
            String b = par.getOrDefault(s2[i], s2[i]);
            if (!find(s1[i]).equals(find(s2[i]))) return false;
        }
        return true;
    }
    public boolean isCorrect(String[] s1, String[] s2, List<List<String>> pairs, boolean output) {
        return areSentencesSimilarTwo(s1, s2, pairs) == output;
    }
}
