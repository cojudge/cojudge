import java.util.regex.Pattern;

class Marker {
    private static final double ABSOLUTE_TOLERANCE = 1e-320;
    private static final double RELATIVE_TOLERANCE = 1e-6;
    private static final Pattern DECIMAL = Pattern.compile(
        "[+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+))(?:[eE][+-]?\\d+)?"
    );

    public String myPow(String x, int n) {
        double base = Double.parseDouble(x);
        long exponent = n;
        if (exponent < 0) {
            base = 1.0 / base;
            exponent = -exponent;
        }

        double result = 1.0;
        while (exponent > 0) {
            if ((exponent & 1L) != 0) result *= base;
            base *= base;
            exponent >>= 1;
        }
        return Double.toString(result);
    }

    public boolean isCorrect(String x, int n, String output) {
        if (output == null || !DECIMAL.matcher(output).matches()) return false;

        try {
            double actual = Double.parseDouble(output);
            double expected = Double.parseDouble(myPow(x, n));
            if (!Double.isFinite(actual) || !Double.isFinite(expected)) return false;

            double tolerance = ABSOLUTE_TOLERANCE
                + RELATIVE_TOLERANCE * Math.abs(expected);
            return Math.abs(actual - expected) <= tolerance;
        } catch (NumberFormatException exception) {
            return false;
        }
    }
}
