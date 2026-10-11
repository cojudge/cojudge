import java.util.regex.Pattern;

class Marker {
    private static final double TOLERANCE = 1e-5;
    private static final Pattern DECIMAL = Pattern.compile(
        "[+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+))(?:[eE][+-]?\\d+)?"
    );

    public String new21Game(int n, int k, int maxPts) {
        if (k == 0) return Double.toString(1.0);
        if (n >= k - 1 + maxPts) return Double.toString(1.0);
        double[] dp = new double[n + 1];
        dp[0] = 1.0;
        double window = 1.0;
        for (int i = 1; i <= n; i++) {
            dp[i] = window / maxPts;
            if (i < k) window += dp[i];
            if (i - maxPts >= 0) window -= dp[i - maxPts];
        }
        double ans = 0.0;
        for (int i = k; i <= n; i++) ans += dp[i];
        return Double.toString(ans);
    }

    public boolean isCorrect(int n, int k, int maxPts, String output) {
        if (output == null || !DECIMAL.matcher(output.trim()).matches()) return false;
        try {
            double actual = Double.parseDouble(output.trim());
            double expected = Double.parseDouble(new21Game(n, k, maxPts));
            if (!Double.isFinite(actual) || !Double.isFinite(expected)) return false;
            return Math.abs(actual - expected) <= TOLERANCE;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
