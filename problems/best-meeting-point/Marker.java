import java.util.*;
class Marker {
    public int minTotalDistance(int[][] grid) {
        List<Integer> rows = new ArrayList<>();
        List<Integer> cols = new ArrayList<>();
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[i].length; j++) {
                if (grid[i][j] == 1) rows.add(i);
            }
        }
        for (int j = 0; j < grid[0].length; j++) {
            for (int i = 0; i < grid.length; i++) {
                if (grid[i][j] == 1) cols.add(j);
            }
        }
        return spread(rows) + spread(cols);
    }
    private int spread(List<Integer> v) {
        if (v.isEmpty()) return 0;
        int med = v.get(v.size() / 2);
        int s = 0;
        for (int x : v) s += Math.abs(x - med);
        return s;
    }
    public boolean isCorrect(int[][] grid, int output) {
        return minTotalDistance(grid) == output;
    }
}
