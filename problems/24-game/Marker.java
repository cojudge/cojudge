import java.util.*;
class Marker {
    private static final double EPS = 1e-6;
    public boolean judgePoint24(int[] cards) {
        List<Double> vals = new ArrayList<>();
        for (int c : cards) vals.add((double) c);
        return dfs(vals);
    }
    private boolean dfs(List<Double> vals) {
        if (vals.size() == 1) return Math.abs(vals.get(0) - 24.0) < EPS;
        for (int i = 0; i < vals.size(); i++) {
            for (int j = 0; j < vals.size(); j++) {
                if (i == j) continue;
                List<Double> next = new ArrayList<>();
                for (int k = 0; k < vals.size(); k++) {
                    if (k != i && k != j) next.add(vals.get(k));
                }
                double a = vals.get(i), b = vals.get(j);
                for (double v : combine(a, b)) {
                    next.add(v);
                    if (dfs(next)) return true;
                    next.remove(next.size() - 1);
                }
            }
        }
        return false;
    }
    private List<Double> combine(double a, double b) {
        List<Double> r = new ArrayList<>();
        r.add(a + b); r.add(a - b); r.add(a * b);
        if (Math.abs(b) > EPS) r.add(a / b);
        return r;
    }
    public boolean isCorrect(int[] cards, boolean output) {
        return judgePoint24(cards) == output;
    }
}
