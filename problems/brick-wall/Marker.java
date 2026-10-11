import java.util.*;
class Marker {
    public int leastBricks(int[][] wall) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int[] row : wall) {
            int sum = 0;
            for (int i = 0; i < row.length - 1; i++) {
                sum += row[i];
                freq.put(sum, freq.getOrDefault(sum, 0) + 1);
            }
        }
        int maxEdge = 0;
        for (int v : freq.values()) maxEdge = Math.max(maxEdge, v);
        return wall.length - maxEdge;
    }
    public boolean isCorrect(int[][] wall, int output) {
        return leastBricks(wall) == output;
    }
}
