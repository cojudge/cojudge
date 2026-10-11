import java.util.*;
class Marker {
    public int minAreaRect(int[][] points) {
        Set<Long> set = new HashSet<>();
        for (int[] p : points) set.add(((long)p[0] << 32) | (p[1] & 0xffffffffL));
        int best = Integer.MAX_VALUE;
        int n = points.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int x1 = points[i][0], y1 = points[i][1];
                int x2 = points[j][0], y2 = points[j][1];
                if (x1 == x2 || y1 == y2) continue;
                long a = ((long)x1 << 32) | (y2 & 0xffffffffL);
                long b = ((long)x2 << 32) | (y1 & 0xffffffffL);
                if (set.contains(a) && set.contains(b)) {
                    int area = Math.abs(x1 - x2) * Math.abs(y1 - y2);
                    if (area < best) best = area;
                    if (best == 1) return 1;
                }
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
    public boolean isCorrect(int[][] points, int output) {
        return minAreaRect(points) == output;
    }
}
