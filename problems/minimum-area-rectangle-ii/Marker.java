import java.util.*;
class Marker {
    public int minAreaFreeRect(int[][] points) {
        int n = points.length;
        Map<String, List<int[]>> groups = new HashMap<>();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                long sx = (long) points[i][0] + points[j][0];
                long sy = (long) points[i][1] + points[j][1];
                long dx = (long) points[i][0] - points[j][0];
                long dy = (long) points[i][1] - points[j][1];
                String key = sx + "," + sy + "," + (dx * dx + dy * dy);
                groups.computeIfAbsent(key, k -> new ArrayList<>()).add(new int[]{i, j});
            }
        }
        long best = Long.MAX_VALUE;
        for (List<int[]> pairs : groups.values()) {
            for (int a = 0; a < pairs.size(); a++) {
                for (int b = a + 1; b < pairs.size(); b++) {
                    int[] p = points[pairs.get(a)[0]];
                    int[] c = points[pairs.get(b)[0]];
                    int[] d = points[pairs.get(b)[1]];
                    long area = Math.abs((long) (c[0] - p[0]) * (d[1] - p[1])
                            - (long) (d[0] - p[0]) * (c[1] - p[1]));
                    if (area > 0) best = Math.min(best, area);
                }
            }
        }
        return best == Long.MAX_VALUE ? 0 : (int) best;
    }
    public boolean isCorrect(int[][] points, int output) {
        return output == minAreaFreeRect(points);
    }
}
