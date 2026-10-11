import java.util.regex.Pattern;
class Marker {
    private static final double ABS_TOL = 1e-9;
    private static final double REL_TOL = 1e-5;
    private static final Pattern DECIMAL = Pattern.compile("[+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+))(?:[eE][+-]?\\d+)?");
    public String largestSumOfAverages(int[] nums, int k) {
        int n = nums.length;
        double[] pref = new double[n + 1];
        for (int i = 0; i < n; i++) pref[i + 1] = pref[i] + nums[i];
        double[][] dp = new double[n + 1][k + 1];
        for (int i = 1; i <= n; i++) dp[i][1] = pref[i] / i;
        for (int g = 2; g <= k; g++)
            for (int i = g; i <= n; i++) {
                double best = 0;
                for (int j = g - 1; j < i; j++) {
                    double cand = dp[j][g - 1] + (pref[i] - pref[j]) / (i - j);
                    if (cand > best) best = cand;
                }
                dp[i][g] = best;
            }
        return Double.toString(dp[n][k]);
    }
    public boolean isCorrect(int[] nums, int k, String output) {
        if (output == null || !DECIMAL.matcher(output.trim()).matches()) return false;
        try {
            double actual = Double.parseDouble(output.trim());
            double expected = Double.parseDouble(largestSumOfAverages(nums, k));
            if (!Double.isFinite(actual) || !Double.isFinite(expected)) return false;
            return Math.abs(actual - expected) <= ABS_TOL + REL_TOL * Math.abs(expected);
        } catch (NumberFormatException ex) { return false; }
    }
}
