import java.util.*;
class Marker {
    public int robotSim(int[] commands, int[][] obstacles) {
        Set<Long> blocked = new HashSet<>();
        for (int[] o : obstacles) blocked.add((((long) o[0]) << 32) | (o[1] & 0xffffffffL));
        int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        int d = 0, x = 0, y = 0, best = 0;
        for (int c : commands) {
            if (c == -2) d = (d + 3) % 4;
            else if (c == -1) d = (d + 1) % 4;
            else {
                for (int s = 0; s < c; s++) {
                    int nx = x + dirs[d][0], ny = y + dirs[d][1];
                    long key = (((long) nx) << 32) | (ny & 0xffffffffL);
                    if (blocked.contains(key)) break;
                    x = nx;
                    y = ny;
                    best = Math.max(best, x * x + y * y);
                }
            }
        }
        return best;
    }
    public boolean isCorrect(int[] commands, int[][] obstacles, int output) {
        return robotSim(commands, obstacles) == output;
    }
}
