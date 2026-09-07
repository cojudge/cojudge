import java.util.*;
class Marker {
    public List<String> calcEquation(List<List<String>> equations, String[] values, List<List<String>> queries) {
        Map<String, Map<String, Double>> g = new HashMap<>();
        for (int i = 0; i < equations.size(); i++) {
            String a = equations.get(i).get(0), b = equations.get(i).get(1);
            double v = Double.parseDouble(values[i]);
            g.computeIfAbsent(a, k -> new HashMap<>()).put(b, v);
            g.computeIfAbsent(b, k -> new HashMap<>()).put(a, 1.0 / v);
        }
        List<String> ans = new ArrayList<>();
        for (List<String> q : queries) {
            double r = dfs(q.get(0), q.get(1), g, new HashSet<>());
            ans.add(format(r));
        }
        return ans;
    }
    private double dfs(String src, String dst, Map<String, Map<String, Double>> g, Set<String> seen) {
        if (!g.containsKey(src) || !g.containsKey(dst)) return -1.0;
        if (src.equals(dst)) return 1.0;
        seen.add(src);
        for (Map.Entry<String, Double> e : g.get(src).entrySet()) {
            if (seen.contains(e.getKey())) continue;
            double sub = dfs(e.getKey(), dst, g, seen);
            if (sub != -1.0) return e.getValue() * sub;
        }
        return -1.0;
    }
    private String format(double v) {
        if (v < 0) return "-1.00000";
        return String.format(java.util.Locale.US, "%.5f", v);
    }
    public boolean isCorrect(List<List<String>> equations, String[] values, List<List<String>> queries, List<String> output) {
        List<String> exp = calcEquation(equations, values, queries);
        if (output == null || output.size() != exp.size()) return false;
        for (int i = 0; i < exp.size(); i++) {
            double a = Double.parseDouble(exp.get(i));
            double b = Double.parseDouble(output.get(i));
            if (Math.abs(a - b) > 1e-4) return false;
        }
        return true;
    }
}
