import java.util.*;
class Marker {
    public boolean escapeGhosts(int[][] ghosts, int[] target) {
        int me = Math.abs(target[0]) + Math.abs(target[1]);
        for (int[] g : ghosts) {
            int d = Math.abs(g[0] - target[0]) + Math.abs(g[1] - target[1]);
            if (d <= me) return false;
        }
        return true;
    }
    public boolean isCorrect(int[][] ghosts, int[] target, boolean output) {
        return escapeGhosts(ghosts, target) == output;
    }
}
