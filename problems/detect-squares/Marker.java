import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Marker {
    public int[] runDetectSquares(String[] operations, int[][] points) {
        DetectSquares squares = new DetectSquares();
        List<Integer> counts = new ArrayList<>();

        for (int i = 1; i < operations.length; i++) {
            if (operations[i].equals("add")) {
                squares.add(points[i]);
            } else if (operations[i].equals("count")) {
                counts.add((int) squares.count(points[i]));
            }
        }

        int[] result = new int[counts.size()];
        for (int i = 0; i < counts.size(); i++) result[i] = counts.get(i);
        return result;
    }

    public boolean isCorrect(String[] operations, int[][] points, int[] output) {
        return Arrays.equals(runDetectSquares(operations, points), output);
    }

    private static class DetectSquares {
        private final Map<Integer, Map<Integer, Integer>> rows = new HashMap<>();

        void add(int[] point) {
            rows.computeIfAbsent(point[1], ignored -> new HashMap<>())
                .merge(point[0], 1, Integer::sum);
        }

        long count(int[] point) {
            int x = point[0];
            int y = point[1];
            Map<Integer, Integer> sameRow = rows.get(y);
            if (sameRow == null) return 0;

            long total = 0;
            for (Map.Entry<Integer, Integer> entry : sameRow.entrySet()) {
                int otherX = entry.getKey();
                if (otherX == x) continue;

                int side = otherX - x;
                total += (long) entry.getValue()
                    * frequency(y + side, x)
                    * frequency(y + side, otherX);
                total += (long) entry.getValue()
                    * frequency(y - side, x)
                    * frequency(y - side, otherX);
            }
            return total;
        }

        private int frequency(int y, int x) {
            Map<Integer, Integer> row = rows.get(y);
            return row == null ? 0 : row.getOrDefault(x, 0);
        }
    }
}
