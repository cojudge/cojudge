import java.util.*;
class Marker {
    public List<String> ambiguousCoordinates(String s) {
        String t = s.substring(1, s.length() - 1);
        List<String> res = new ArrayList<>();
        for (int i = 1; i < t.length(); i++) {
            List<String> left = make(t.substring(0, i));
            List<String> right = make(t.substring(i));
            for (String a : left) for (String b : right) res.add("(" + a + ", " + b + ")");
        }
        return res;
    }
    private List<String> make(String s) {
        List<String> res = new ArrayList<>();
        int n = s.length();
        if (n == 0) return res;
        if (n == 1) { res.add(s); return res; }
        if (s.charAt(0) == '0' && s.charAt(n - 1) == '0') return res;
        if (s.charAt(0) == '0') {
            res.add("0." + s.substring(1));
            return res;
        }
        if (s.charAt(n - 1) == '0') { res.add(s); return res; }
        res.add(s);
        for (int i = 1; i < n; i++) res.add(s.substring(0, i) + "." + s.substring(i));
        return res;
    }
    private List<String> norm(List<String> l) {
        List<String> c = new ArrayList<>(l);
        Collections.sort(c);
        return c;
    }
    public boolean isCorrect(String s, List<String> output) {
        if (output == null) return false;
        return norm(ambiguousCoordinates(s)).equals(norm(output));
    }
}
