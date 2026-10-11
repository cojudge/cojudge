import java.util.*;
class Marker {
    public List<String> findStrobogrammatic(int n) {
        return build(n, n);
    }

    private List<String> build(int n, int total) {
        if (n == 0) return new ArrayList<>(Arrays.asList(""));
        if (n == 1) return new ArrayList<>(Arrays.asList("0", "1", "8"));
        List<String> inner = build(n - 2, total);
        List<String> res = new ArrayList<>();
        for (String s : inner) {
            if (n != total) res.add("0" + s + "0");
            res.add("1" + s + "1");
            res.add("6" + s + "9");
            res.add("8" + s + "8");
            res.add("9" + s + "6");
        }
        return res;
    }

    public boolean isCorrect(int n, List<String> output) {
        if (output == null) return false;
        List<String> expected = new ArrayList<>(findStrobogrammatic(n));
        List<String> actual = new ArrayList<>(output);
        Collections.sort(expected);
        Collections.sort(actual);
        return expected.equals(actual);
    }
}
