import java.util.*;
class Marker {
    private int dist(int[] a, int[] b) {
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    }
    public int minDistance(int height, int width, int[] tree, int[] squirrel, int[][] nuts) {
        int total = 0, best = Integer.MAX_VALUE;
        for (int[] nut : nuts) {
            int d = dist(tree, nut);
            total += 2 * d;
            best = Math.min(best, dist(squirrel, nut) - d);
        }
        return total + best;
    }
    public boolean isCorrect(int height, int width, int[] tree, int[] squirrel, int[][] nuts, int output) {
        return output == minDistance(height, width, tree, squirrel, nuts);
    }
}
