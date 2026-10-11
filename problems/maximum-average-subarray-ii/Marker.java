import java.util.regex.Pattern;
class Marker {
    private static final double ABS_TOL = 1e-9;
    private static final double REL_TOL = 1e-5;
    private static final Pattern DECIMAL = Pattern.compile("[+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+))(?:[eE][+-]?\\d+)?");
    private boolean ok(double[] a, int k, double mid) {
        int n = a.length;
        double[] pre = new double[n + 1];
        for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + a[i] - mid;
        double minPre = 0;
        for (int i = k; i <= n; i++) {
            minPre = Math.min(minPre, pre[i - k]);
            if (pre[i] - minPre >= 0) return true;
        }
        return false;
    }
    public String findMaxAverage(int[] nums, int k) {
        double[] a = new double[nums.length];
        for (int i = 0; i < nums.length; i++) a[i] = nums[i];
        double lo = -1e4, hi = 1e4;
        for (int v : nums) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
        for (int it = 0; it < 60; it++) {
            double mid = (lo + hi) / 2;
            if (ok(a, k, mid)) lo = mid; else hi = mid;
        }
        double ans = lo;
        return Double.toString(ans);
    }
    public boolean isCorrect(int[] nums, int k, String output) {
        if (output == null || !DECIMAL.matcher(output.trim()).matches()) return false;
        try {
            double a = Double.parseDouble(output.trim());
            double e = Double.parseDouble(findMaxAverage(nums, k));
            if (!Double.isFinite(a) || !Double.isFinite(e)) return false;
            return Math.abs(a - e) <= ABS_TOL + REL_TOL * Math.abs(e);
        } catch (NumberFormatException ex) { return false; }
    }
}
