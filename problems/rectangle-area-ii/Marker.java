import java.util.*;
class Marker {
    public int rectangleArea(int[][] rectangles) {
        TreeSet<Integer> xs = new TreeSet<>(), ys = new TreeSet<>();
        for (int[] r : rectangles) { xs.add(r[0]); xs.add(r[2]); ys.add(r[1]); ys.add(r[3]); }
        List<Integer> xl = new ArrayList<>(xs), yl = new ArrayList<>(ys);
        long ans = 0, MOD = 1000000007L;
        for (int i = 0; i + 1 < xl.size(); i++) {
            for (int j = 0; j + 1 < yl.size(); j++) {
                int x1 = xl.get(i), x2 = xl.get(i+1), y1 = yl.get(j), y2 = yl.get(j+1);
                boolean cov = false;
                for (int[] r : rectangles) {
                    if (r[0] <= x1 && x2 <= r[2] && r[1] <= y1 && y2 <= r[3]) { cov = true; break; }
                }
                if (cov) ans = (ans + (long)(x2 - x1) * (y2 - y1)) % MOD;
            }
        }
        return (int) ans;
    }
    public boolean isCorrect(int[][] rectangles, int output) {
        return rectangleArea(rectangles) == output;
    }
}
