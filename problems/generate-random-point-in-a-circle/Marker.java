import java.util.*;
class Marker {
    public List<String> randPoint(String radius, String xCenter, String yCenter) {
        double r = Double.parseDouble(radius);
        double xc = Double.parseDouble(xCenter);
        double yc = Double.parseDouble(yCenter);
        Random rnd = new Random(12345);
        double u = rnd.nextDouble();
        double theta = rnd.nextDouble() * 2.0 * Math.PI;
        double d = r * Math.sqrt(u);
        double x = xc + d * Math.cos(theta);
        double y = yc + d * Math.sin(theta);
        List<String> out = new ArrayList<>();
        out.add(Double.toString(x));
        out.add(Double.toString(y));
        return out;
    }
    public boolean isCorrect(String radius, String xCenter, String yCenter, List<String> output) {
        if (output == null || output.size() != 2) return false;
        try {
            double r = Double.parseDouble(radius);
            double xc = Double.parseDouble(xCenter);
            double yc = Double.parseDouble(yCenter);
            double x = Double.parseDouble(output.get(0));
            double y = Double.parseDouble(output.get(1));
            if (!Double.isFinite(x) || !Double.isFinite(y)) return false;
            if (!Double.isFinite(r) || r < 0) return false;
            double dx = x - xc;
            double dy = y - yc;
            double dist = Math.sqrt(dx * dx + dy * dy);
            double tol = 1e-9 + 1e-9 * Math.abs(r);
            return dist <= r + tol;
        } catch (Exception e) {
            return false;
        }
    }
}
