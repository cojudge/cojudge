import java.util.*;
class Marker {
    public List<String> solve(String[] operations, int[][] values) {
        List<String> result = new ArrayList<>();
        RandPoint obj = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("RandPoint")) {
                obj = new RandPoint(values[i][0], values[i][1], values[i][2]);
                result.add("null");
            } else if (op.equals("randPoint")) {
                double[] p = obj.randPoint();
                result.add("[" + p[0] + "," + p[1] + "]");
            }
        }
        return result;
    }

    public boolean isCorrect(String[] operations, int[][] values, List<String> output) {
        if (operations == null || values == null || output == null) return false;
        if (values.length != operations.length || output.size() != operations.length) return false;
        double r = 0, xc = 0, yc = 0;
        boolean live = false;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            String got = output.get(i).trim();
            if (op.equals("RandPoint")) {
                if (!got.equals("null")) return false;
                if (values[i] == null || values[i].length < 3) return false;
                r = values[i][0];
                xc = values[i][1];
                yc = values[i][2];
                if (!(r > 0) || !Double.isFinite(xc) || !Double.isFinite(yc)) return false;
                live = true;
            } else if (op.equals("randPoint")) {
                if (!live) return false;
                double[] p = parsePoint(got);
                if (p == null) return false;
                if (!Double.isFinite(p[0]) || !Double.isFinite(p[1])) return false;
                double dx = p[0] - xc;
                double dy = p[1] - yc;
                double dist2 = dx * dx + dy * dy;
                if (!(dist2 <= r * r * (1 + 1e-9) + 1e-9)) return false;
            } else {
                return false;
            }
        }
        return live;
    }

    private double[] parsePoint(String s) {
        if (s == null) return null;
        s = s.trim();
        if (!s.startsWith("[") || !s.endsWith("]")) return null;
        String[] parts = s.substring(1, s.length() - 1).split(",");
        if (parts.length != 2) return null;
        try {
            return new double[]{Double.parseDouble(parts[0].trim()), Double.parseDouble(parts[1].trim())};
        } catch (NumberFormatException e) {
            return null;
        }
    }

    static class RandPoint {
        private final double xc, yc;
        RandPoint(double radius, double xCenter, double yCenter) {
            this.xc = xCenter;
            this.yc = yCenter;
        }
        double[] randPoint() {
            return new double[]{xc, yc};
        }
    }
}
