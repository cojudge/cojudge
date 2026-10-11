import java.util.*;
class Marker {
    public boolean isReflected(int[][] points) {
        if (points == null || points.length == 0) return true;
        int mn = Integer.MAX_VALUE, mx = Integer.MIN_VALUE;
        Set<Long> set = new HashSet<>();
        for (int[] p : points) {
            mn = Math.min(mn, p[0]);
            mx = Math.max(mx, p[0]);
            set.add((((long) p[0]) << 32) ^ (p[1] & 0xffffffffL));
        }
        long sum = (long) mn + mx;
        for (int[] p : points) {
            long rx = sum - p[0];
            long key = (rx << 32) ^ (p[1] & 0xffffffffL);
            if (!set.contains(key)) return false;
        }
        return true;
    }
    public boolean isCorrect(int[][] points, boolean output) {
        return isReflected(points) == output;
    }
}
