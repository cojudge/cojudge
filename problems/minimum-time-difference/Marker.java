import java.util.*;
class Marker {
    public int findMinDifference(String[] timePoints) {
        int n = timePoints.length;
        int[] mins = new int[n];
        for (int i = 0; i < n; i++) {
            String t = timePoints[i];
            int h = Integer.parseInt(t.substring(0, 2));
            int m = Integer.parseInt(t.substring(3, 5));
            mins[i] = h * 60 + m;
        }
        Arrays.sort(mins);
        int best = 1440 - mins[n - 1] + mins[0];
        for (int i = 1; i < n; i++) best = Math.min(best, mins[i] - mins[i - 1]);
        return best;
    }
    public boolean isCorrect(String[] timePoints, int output) {
        return findMinDifference(timePoints) == output;
    }
}
