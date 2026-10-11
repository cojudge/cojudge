import java.util.*;
class Marker {
    public int numberOfBoomerangs(int[][] points) {
        int n = points.length;
        int ans = 0;
        for (int i = 0; i < n; i++) {
            Map<Long, Integer> map = new HashMap<>();
            for (int j = 0; j < n; j++) {
                if (i == j) continue;
                long dx = (long) points[i][0] - points[j][0];
                long dy = (long) points[i][1] - points[j][1];
                long d = dx * dx + dy * dy;
                map.put(d, map.getOrDefault(d, 0) + 1);
            }
            for (int c : map.values()) ans += c * (c - 1);
        }
        return ans;
    }
    public boolean isCorrect(int[][] points, int output) {
        return numberOfBoomerangs(points) == output;
    }
}
