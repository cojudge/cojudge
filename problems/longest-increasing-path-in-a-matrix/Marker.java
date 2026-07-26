import java.util.ArrayDeque;
import java.util.Queue;

class Marker {
    private static final int[][] DIRECTIONS = {
        {1, 0}, {-1, 0}, {0, 1}, {0, -1}
    };

    public int longestIncreasingPath(int[][] matrix) {
        int rows = matrix.length;
        int columns = matrix[0].length;
        int[][] outdegree = new int[rows][columns];
        Queue<int[]> queue = new ArrayDeque<>();

        for (int row = 0; row < rows; row++) {
            for (int column = 0; column < columns; column++) {
                for (int[] direction : DIRECTIONS) {
                    int nextRow = row + direction[0];
                    int nextColumn = column + direction[1];
                    if (inBounds(nextRow, nextColumn, rows, columns)
                            && matrix[nextRow][nextColumn] > matrix[row][column]) {
                        outdegree[row][column]++;
                    }
                }
                if (outdegree[row][column] == 0) {
                    queue.offer(new int[]{row, column});
                }
            }
        }

        int length = 0;
        while (!queue.isEmpty()) {
            int layerSize = queue.size();
            length++;
            for (int i = 0; i < layerSize; i++) {
                int[] cell = queue.poll();
                for (int[] direction : DIRECTIONS) {
                    int previousRow = cell[0] + direction[0];
                    int previousColumn = cell[1] + direction[1];
                    if (inBounds(previousRow, previousColumn, rows, columns)
                            && matrix[previousRow][previousColumn] < matrix[cell[0]][cell[1]]
                            && --outdegree[previousRow][previousColumn] == 0) {
                        queue.offer(new int[]{previousRow, previousColumn});
                    }
                }
            }
        }
        return length;
    }

    private boolean inBounds(int row, int column, int rows, int columns) {
        return row >= 0 && row < rows && column >= 0 && column < columns;
    }

    public boolean isCorrect(int[][] matrix, int output) {
        return output == longestIncreasingPath(matrix);
    }
}
