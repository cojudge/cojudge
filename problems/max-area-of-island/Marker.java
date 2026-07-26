import java.util.*;

class Marker {
    private static final int[][] DIRECTIONS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    public int maxAreaOfIsland(int[][] grid) {
        if (grid.length == 0 || grid[0].length == 0) return 0;
        int rows = grid.length;
        int cols = grid[0].length;
        boolean[][] visited = new boolean[rows][cols];
        int largest = 0;

        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                if (grid[row][col] == 0 || visited[row][col]) continue;
                int area = 0;
                Deque<int[]> queue = new ArrayDeque<>();
                queue.add(new int[]{row, col});
                visited[row][col] = true;
                while (!queue.isEmpty()) {
                    int[] cell = queue.remove();
                    area++;
                    for (int[] direction : DIRECTIONS) {
                        int nextRow = cell[0] + direction[0];
                        int nextCol = cell[1] + direction[1];
                        if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) continue;
                        if (grid[nextRow][nextCol] == 0 || visited[nextRow][nextCol]) continue;
                        visited[nextRow][nextCol] = true;
                        queue.add(new int[]{nextRow, nextCol});
                    }
                }
                largest = Math.max(largest, area);
            }
        }
        return largest;
    }

    public boolean isCorrect(int[][] grid, int output) {
        return maxAreaOfIsland(deepCopy(grid)) == output;
    }

    private int[][] deepCopy(int[][] grid) {
        int[][] copy = new int[grid.length][];
        for (int i = 0; i < grid.length; i++) copy[i] = grid[i].clone();
        return copy;
    }
}
