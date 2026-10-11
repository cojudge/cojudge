import java.util.*;
class Marker {
    public int strobogrammaticInRange(String low, String high) {
        int count = 0;
        for (int len = low.length(); len <= high.length(); len++) {
            for (String s : build(len, len)) {
                if ((s.length() == low.length() && s.compareTo(low) < 0)
                        || (s.length() == high.length() && s.compareTo(high) > 0)) {
                    continue;
                }
                count++;
            }
        }
        return count;
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

    public boolean isCorrect(String low, String high, int output) {
        return output == strobogrammaticInRange(low, high);
    }
}
