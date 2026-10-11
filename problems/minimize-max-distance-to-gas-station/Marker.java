import java.util.regex.Pattern;
class Marker {
    private static final double ABS_TOL = 1e-9;
    private static final double REL_TOL = 1e-5;
    private static final Pattern DECIMAL = Pattern.compile("[+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+))(?:[eE][+-]?\\d+)?");
    public String minmaxGasDist(int[] stations, int k) {
        double lo = 0, hi = 1e8;
        for (int it = 0; it < 80; it++) {
            double mid = (lo + hi) / 2;
            if (feasible(stations, k, mid)) hi = mid;
            else lo = mid;
        }
        return Double.toString(hi);
    }
    private boolean feasible(int[] stations, int k, double d) {
        if (d <= 0) return false;
        long need = 0;
        for (int i = 1; i < stations.length; i++) {
            double gap = (double) stations[i] - stations[i - 1];
            need += (long) ((gap - 1e-9) / d);
            if (need > k) return false;
        }
        return need <= k;
    }
    public boolean isCorrect(int[] stations, int k, String output) {
        if (output == null || !DECIMAL.matcher(output.trim()).matches()) return false;
        try {
            double a = Double.parseDouble(output.trim());
            double e = Double.parseDouble(minmaxGasDist(stations, k));
            if (!Double.isFinite(a) || !Double.isFinite(e)) return false;
            return Math.abs(a - e) <= ABS_TOL + REL_TOL * Math.abs(e);
        } catch (NumberFormatException ex) { return false; }
    }
}
