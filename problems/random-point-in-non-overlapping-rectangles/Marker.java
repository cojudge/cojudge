import java.util.*;
class Marker {
    public int[] pickPoint(int[][] rects) {
        return new int[]{rects[0][0], rects[0][1]};
    }
    public boolean isCorrect(int[][] rects, int[] output) {
        if (output == null || output.length != 2) return false;
        int x = output[0], y = output[1];
        for (int[] r : rects) {
            if (r == null || r.length != 4) continue;
            if (x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3]) return true;
        }
        return false;
    }
}
