import java.util.regex.Pattern;
class Marker {
    private static final double ABS_TOL = 1e-9;
    private static final double REL_TOL = 1e-5;
    private static final Pattern DECIMAL = Pattern.compile("[+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+))(?:[eE][+-]?\\d+)?");
    public String champagneTower(int poured, int query_row, int query_glass) {
        double[][] dp = new double[query_row + 2][query_row + 2];
        dp[0][0] = poured;
        for (int r = 0; r <= query_row; r++) {
            for (int c = 0; c <= r; c++) {
                double excess = (dp[r][c] - 1.0) / 2.0;
                if (excess > 0) {
                    dp[r + 1][c] += excess;
                    dp[r + 1][c + 1] += excess;
                }
            }
        }
        double ans = Math.min(1.0, dp[query_row][query_glass]);
        return Double.toString(ans);
    }
    public boolean isCorrect(int poured, int query_row, int query_glass, String output) {
        if (output == null || !DECIMAL.matcher(output.trim()).matches()) return false;
        try {
            double a = Double.parseDouble(output.trim());
            double e = Double.parseDouble(champagneTower(poured, query_row, query_glass));
            if (!Double.isFinite(a) || !Double.isFinite(e)) return false;
            return Math.abs(a - e) <= ABS_TOL + REL_TOL * Math.abs(e);
        } catch (NumberFormatException ex) { return false; }
    }
}
