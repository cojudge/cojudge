import java.util.regex.Pattern;
class Marker {
    private static final double ABS_TOL = 1e-9;
    private static final double REL_TOL = 1e-5;
    private static final Pattern DECIMAL = Pattern.compile("[+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+))(?:[eE][+-]?\\d+)?");
    private static final int[][] MOVES = {{2,1},{1,2},{-1,2},{-2,1},{-2,-1},{-1,-2},{1,-2},{2,-1}};
    public String knightProbability(int n, int k, int row, int column) {
        double[][] cur = new double[n][n];
        cur[row][column] = 1.0;
        for (int step = 0; step < k; step++) {
            double[][] nxt = new double[n][n];
            for (int r = 0; r < n; r++) {
                for (int c = 0; c < n; c++) {
                    if (cur[r][c] == 0) continue;
                    for (int[] m : MOVES) {
                        int nr = r + m[0], nc = c + m[1];
                        if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
                            nxt[nr][nc] += cur[r][c] / 8.0;
                        }
                    }
                }
            }
            cur = nxt;
        }
        double sum = 0;
        for (int r = 0; r < n; r++) for (int c = 0; c < n; c++) sum += cur[r][c];
        return Double.toString(sum);
    }
    public boolean isCorrect(int n, int k, int row, int column, String output) {
        if (output == null || !DECIMAL.matcher(output.trim()).matches()) return false;
        try {
            double a = Double.parseDouble(output.trim());
            double e = Double.parseDouble(knightProbability(n, k, row, column));
            if (!Double.isFinite(a) || !Double.isFinite(e)) return false;
            return Math.abs(a - e) <= ABS_TOL + REL_TOL * Math.abs(e);
        } catch (NumberFormatException ex) { return false; }
    }
}
