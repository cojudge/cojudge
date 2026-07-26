import java.util.*;

class Marker {
    public int swimInWater(int[][] grid) {
        int n = grid.length;
        boolean[][] visited = new boolean[n][n];
        PriorityQueue<int[]> queue = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        queue.add(new int[]{grid[0][0], 0, 0});
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!queue.isEmpty()) {
            int[] current = queue.remove();
            int time = current[0];
            int row = current[1];
            int col = current[2];
            if (visited[row][col]) continue;
            visited[row][col] = true;
            if (row == n - 1 && col == n - 1) return time;

            for (int[] direction : directions) {
                int nextRow = row + direction[0];
                int nextCol = col + direction[1];
                if (nextRow >= 0 && nextRow < n && nextCol >= 0 && nextCol < n
                        && !visited[nextRow][nextCol]) {
                    queue.add(new int[]{Math.max(time, grid[nextRow][nextCol]), nextRow, nextCol});
                }
            }
        }
        return -1;
    }

    public boolean isCorrect(int[][] grid, int output) {
        return swimInWater(grid) == output;
    }
}
