import java.util.*;
class Marker {
    public boolean isConvex(int[][] polygon) {
        int n = polygon.length;
        int sign = 0;
        for (int i = 0; i < n; i++) {
            int[] a = polygon[i];
            int[] b = polygon[(i + 1) % n];
            int[] c = polygon[(i + 2) % n];
            long cross = (long)(b[0] - a[0]) * (c[1] - b[1]) - (long)(b[1] - a[1]) * (c[0] - b[0]);
            if (cross != 0) {
                int s = cross > 0 ? 1 : -1;
                if (sign == 0) sign = s;
                else if (sign != s) return false;
            }
        }
        return true;
    }
    public boolean isCorrect(int[][] polygon, boolean output) {
        return isConvex(polygon) == output;
    }
}
