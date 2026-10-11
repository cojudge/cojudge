import java.util.regex.Pattern;
class Marker {
    private static final double ABS_TOL = 1e-9;
    private static final double REL_TOL = 1e-5;
    private static final Pattern DECIMAL = Pattern.compile("[+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+))(?:[eE][+-]?\\d+)?");
    public String soupServings(int n) {
        if (n >= 5000) return Double.toString(1.0);
        int m = (n + 24) / 25;
        Double[][] memo = new Double[m + 1][m + 1];
        double ans = dfs(m, m, memo);
        return Double.toString(ans);
    }
    private double dfs(int a, int b, Double[][] memo) {
        if (a <= 0 && b <= 0) return 0.5;
        if (a <= 0) return 1.0;
        if (b <= 0) return 0.0;
        if (memo[a][b] != null) return memo[a][b];
        double v = (dfs(a - 4, b, memo) + dfs(a - 3, b - 1, memo) + dfs(a - 2, b - 2, memo) + dfs(a - 1, b - 3, memo)) / 4.0;
        memo[a][b] = v;
        return v;
    }
    public boolean isCorrect(int n, String output) {
        if (output == null || !DECIMAL.matcher(output.trim()).matches()) return false;
        try {
            double a = Double.parseDouble(output.trim());
            double e = Double.parseDouble(soupServings(n));
            if (!Double.isFinite(a) || !Double.isFinite(e)) return false;
            return Math.abs(a - e) <= ABS_TOL + REL_TOL * Math.abs(e);
        } catch (NumberFormatException ex) { return false; }
    }
}
