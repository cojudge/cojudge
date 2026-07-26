import java.util.*;

class Marker {
    private static final int[][] DIRECTIONS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    public int orangesRotting(int[][] grid) {
        int[][] state = deepCopy(grid);
        int rows = state.length;
        int cols = state[0].length;
        int fresh = 0;
        Deque<int[]> queue = new ArrayDeque<>();

        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                if (state[row][col] == 1) fresh++;
                if (state[row][col] == 2) queue.add(new int[]{row, col});
            }
        }

        int minutes = 0;
        while (fresh > 0 && !queue.isEmpty()) {
            int layerSize = queue.size();
            for (int i = 0; i < layerSize; i++) {
                int[] cell = queue.remove();
                for (int[] direction : DIRECTIONS) {
                    int nextRow = cell[0] + direction[0];
                    int nextCol = cell[1] + direction[1];
                    if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) continue;
                    if (state[nextRow][nextCol] != 1) continue;
                    state[nextRow][nextCol] = 2;
                    fresh--;
                    queue.add(new int[]{nextRow, nextCol});
                }
            }
            minutes++;
        }
        return fresh == 0 ? minutes : -1;
    }

    public boolean isCorrect(int[][] grid, int output) {
        return orangesRotting(deepCopy(grid)) == output;
    }

    private int[][] deepCopy(int[][] matrix) {
        int[][] copy = new int[matrix.length][];
        for (int i = 0; i < matrix.length; i++) copy[i] = matrix[i].clone();
        return copy;
    }
}
