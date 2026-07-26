import java.util.*;

class Marker {
    public int minCostConnectPoints(int[][] points) {
        int n = points.length;
        int[] best = new int[n];
        Arrays.fill(best, Integer.MAX_VALUE);
        boolean[] inTree = new boolean[n];
        best[0] = 0;
        int total = 0;

        for (int added = 0; added < n; added++) {
            int next = -1;
            for (int i = 0; i < n; i++) {
                if (!inTree[i] && (next == -1 || best[i] < best[next])) next = i;
            }
            inTree[next] = true;
            total += best[next];

            for (int i = 0; i < n; i++) {
                if (!inTree[i]) {
                    int distance = Math.abs(points[next][0] - points[i][0])
                            + Math.abs(points[next][1] - points[i][1]);
                    if (distance < best[i]) best[i] = distance;
                }
            }
        }
        return total;
    }

    public boolean isCorrect(int[][] points, int output) {
        return minCostConnectPoints(points) == output;
    }
}
