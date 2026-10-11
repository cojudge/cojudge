import java.util.regex.Pattern;
class Marker {
    private static final double ABS_TOL = 1e-9;
    private static final double REL_TOL = 1e-5;
    private static final Pattern DECIMAL = Pattern.compile("[+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+))(?:[eE][+-]?\\d+)?");
    public String largestTriangleArea(int[][] points) {
        double best = 0.0;
        int n = points.length;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                for (int k = j + 1; k < n; k++) {
                    double a = area(points[i], points[j], points[k]);
                    if (a > best) best = a;
                }
        return Double.toString(best);
    }
    private double area(int[] a, int[] b, int[] c) {
        return Math.abs(a[0]*(b[1]-c[1]) + b[0]*(c[1]-a[1]) + c[0]*(a[1]-b[1])) / 2.0;
    }
    public boolean isCorrect(int[][] points, String output) {
        if (output == null || !DECIMAL.matcher(output.trim()).matches()) return false;
        try {
            double actual = Double.parseDouble(output.trim());
            double expected = Double.parseDouble(largestTriangleArea(points));
            if (!Double.isFinite(actual) || !Double.isFinite(expected)) return false;
            return Math.abs(actual - expected) <= ABS_TOL + REL_TOL * Math.abs(expected);
        } catch (NumberFormatException ex) { return false; }
    }
}
